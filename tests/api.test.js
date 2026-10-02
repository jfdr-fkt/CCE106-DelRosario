const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server/index');

let server;
let baseUrl;

before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
});

async function login(password = 'Student123!', email = 'student@example.com') {
  return fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

test('login verifies passwords and returns unique tokens without password hashes', async () => {
  assert.equal((await login('incorrect')).status, 401);
  assert.equal((await login('Student123!', 'missing@example.com')).status, 401);
  assert.equal((await login('')).status, 400);
  assert.equal((await login('x'.repeat(73))).status, 400);

  const response = await login('Student123!', ' STUDENT@EXAMPLE.COM ');
  assert.equal(response.status, 200);
  const session = await response.json();
  assert.match(session.token, /^[a-f0-9]{64}$/);
  assert.ok(session.expiresAt > Date.now());
  assert.deepEqual(session.user, {
    id: 1, name: 'Exam Student', email: 'student@example.com', username: 'student',
  });
  const secondSession = await (await login()).json();
  assert.notEqual(session.token, secondSession.token);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('protected endpoints reject missing and invalid tokens', async () => {
  for (const path of ['/profile', '/students', '/students/1']) {
    assert.equal((await fetch(`${baseUrl}${path}`)).status, 401);
    assert.equal((await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: 'Bearer __proto__' },
    })).status, 401);
  }
});

test('profile uses the server session and logout revokes it', async () => {
  const session = await (await login()).json();
  const headers = { Authorization: `Bearer ${session.token}` };
  const profile = await fetch(`${baseUrl}/profile`, { headers });
  assert.equal(profile.status, 200);
  assert.deepEqual(await profile.json(), session.user);
  assert.equal((await fetch(`${baseUrl}/logout`, { method: 'POST', headers })).status, 204);
  assert.equal((await fetch(`${baseUrl}/profile`, { headers })).status, 401);
  assert.equal((await fetch(`${baseUrl}/students`, { headers })).status, 401);
});

test('expired tokens are rejected', async t => {
  const session = await (await login()).json();
  t.mock.method(Date, 'now', () => session.expiresAt + 1);
  const response = await fetch(`${baseUrl}/profile`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  assert.equal(response.status, 401);
});

test('students come from the supplied API and upstream failures stay visible', async t => {
  const session = await (await login()).json();
  const headers = { Authorization: `Bearer ${session.token}` };
  const realFetch = global.fetch;
  const upstreamRequests = [];
  const record = { id: 1, name: 'API record', email: 'record@example.com' };
  let upstreamStatus = 200;

  t.mock.method(global, 'fetch', async (url, options) => {
    if (url.startsWith('https://jsonplaceholder.typicode.com/')) {
      upstreamRequests.push({ url, options });
      if (upstreamStatus === 0) {
        throw new Error('Network unavailable');
      }
      return new Response(JSON.stringify(url.endsWith('/users') ? [record] : record), {
        status: upstreamStatus,
      });
    }
    return realFetch(url, options);
  });

  const list = await fetch(`${baseUrl}/students`, { headers });
  assert.equal(list.status, 200);
  assert.deepEqual(await list.json(), [record]);
  const detail = await fetch(`${baseUrl}/students/1`, { headers });
  assert.equal(detail.status, 200);
  assert.deepEqual(await detail.json(), record);
  assert.deepEqual(upstreamRequests.map(request => request.url), [
    'https://jsonplaceholder.typicode.com/users',
    'https://jsonplaceholder.typicode.com/users/1',
  ]);
  assert.ok(upstreamRequests.every(request => !request.options.headers));
  assert.equal((await fetch(`${baseUrl}/students/invalid`, { headers })).status, 400);

  upstreamStatus = 404;
  assert.equal((await fetch(`${baseUrl}/students/999`, { headers })).status, 404);
  upstreamStatus = 500;
  assert.equal((await fetch(`${baseUrl}/students`, { headers })).status, 502);
  upstreamStatus = 0;
  assert.equal((await fetch(`${baseUrl}/students`, { headers })).status, 502);
});
