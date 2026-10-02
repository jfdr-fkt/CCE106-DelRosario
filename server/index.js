const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const account = require('./account.json');

const app = express();
const port = Number(process.env.PORT || 3000);
const sessions = {};
const studentApi = 'https://jsonplaceholder.typicode.com';
const profile = {
  id: account.id,
  name: account.name,
  email: account.email,
  username: account.username,
};

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Student Service Portal API is running.' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string' ||
      !email.trim() || !password || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ message: 'Please enter a valid email and password.' });
  }

  const passwordMatches = await bcrypt.compare(password, account.passwordHash);
  if (email.trim().toLowerCase() !== account.email || !passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  for (const savedToken of Object.keys(sessions)) {
    if (sessions[savedToken].expiresAt <= Date.now()) {
      delete sessions[savedToken];
    }
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
  sessions[token] = { expiresAt };
  res.json({ token, expiresAt, user: profile });
});

function authenticate(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const session = Object.hasOwn(sessions, token) ? sessions[token] : null;

  if (!session || session.expiresAt <= Date.now()) {
    delete sessions[token];
    return res.status(401).json({ message: 'Please sign in again.' });
  }

  req.token = token;
  next();
}

app.get('/profile', authenticate, (req, res) => {
  res.json(profile);
});

app.post('/logout', authenticate, (req, res) => {
  delete sessions[req.token];
  res.status(204).end();
});

app.get('/students', authenticate, async (req, res) => {
  try {
    const response = await fetch(`${studentApi}/users`, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
      return res.status(502).json({ message: 'Unable to retrieve student records.' });
    }
    res.json(await response.json());
  } catch {
    res.status(502).json({ message: 'Unable to reach the student API. Please try again.' });
  }
});

app.get('/students/:id', authenticate, async (req, res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid student ID.' });
  }

  try {
    const response = await fetch(`${studentApi}/users/${req.params.id}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 404) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    if (!response.ok) {
      return res.status(502).json({ message: 'Unable to retrieve student details.' });
    }
    res.json(await response.json());
  } catch {
    res.status(502).json({ message: 'Unable to reach the student API. Please try again.' });
  }
});

if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Student Service Portal API running on port ${port}`);
  });
}

module.exports = app;
