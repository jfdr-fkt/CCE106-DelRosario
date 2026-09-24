const BASE_URL = 'https://dummyjson.com';

export async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 30,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed. Check your username and password.');
  }

  const data = await response.json();
  return data;
}

export async function getCurrentUser(token) {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Session expired or rejected.');
  }

  return response.json();
}