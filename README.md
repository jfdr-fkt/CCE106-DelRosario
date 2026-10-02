# CCE106 Practical Laboratory Examination

## Student Service Portal

### Student Information

Name:

Section:

Date: October 2, 2026

### Required Features

- [x] Login
- [x] Authentication state
- [x] Secure token storage
- [x] Protected navigation
- [x] Dashboard
- [x] Student API request
- [x] Loading state
- [x] Error state
- [x] Empty state
- [x] Search/filter
- [x] Dynamic student details
- [x] Profile
- [x] Session restoration
- [x] Logout

### How to Run

Use Node.js 20.19 or newer. Install dependencies in the project folder:

```sh
npm install
```

Start the local API in the first terminal:

```sh
npm run api
```

Keep it open. Start Expo in a second terminal:

```sh
npx expo start
```

Press `w` for web, or scan the QR code with Expo Go for SDK 54.

Test account:

- Email: `student@example.com`
- Password: `Student123!`

This is a public test account for the examination. The server stores its bcrypt
password hash in `server/account.json` and verifies the password during login.
Incorrect passwords are rejected. Passwords are not saved in the app.

### Expo Go on a Phone

Keep the computer and phone on the same Wi-Fi. Start Expo using its default LAN
connection. The app reads Expo's computer address and uses port 3000 for the API.
On web, it uses the current browser hostname. Allow the Node.js server through
the computer's firewall if the phone cannot connect.

If the automatic address does not work, create `.env.local` in the project folder:

```sh
EXPO_PUBLIC_API_URL=http://192.168.1.5:3000
```

Replace the example address with your computer's Wi-Fi IPv4 address from
`ipconfig`, then restart Expo. The phone must be able to reach this address.
An Expo tunnel does not expose the separate API server. This project uses a
local development API; it is not deployed online.

### API

The instructor's supplied base URL is `https://jsonplaceholder.typicode.com`.
It provides `/users`, but does not implement the starter's login, student, or
profile endpoints. This project adds its own local API to supply those endpoints.
It is a student implementation, not an instructor-provided authentication service.

The app's API address is set in `constants/api.ts`. The local server implements:

| Request | Response |
| --- | --- |
| `POST /login` | `{ token, expiresAt, user }` |
| `GET /students` | Array from JSONPlaceholder `/users` |
| `GET /students/{id}` | Record from JSONPlaceholder `/users/{id}` |
| `GET /profile` | Signed-in test account's public profile |
| `POST /logout` | Invalidates the token and returns HTTP 204 |

Login accepts `{ email, password }`. Other endpoints require
`Authorization: Bearer <token>`. Missing, expired, or invalid tokens return HTTP 401.
The server creates a random token for each successful login; tokens are not hardcoded.
Responses never include password hashes.

Student records are fetched from the supplied API for every request. No student
records are manually entered or used as a fallback. Screens display the fields
that JSONPlaceholder supplies, including username, phone, city, and company.
The profile represents the local login account, separately from the student list.

### Sessions and Navigation

The application tabs and dynamic `/student/{id}` route require authentication.
Student screens include loading, error, empty, search, and retry states.
Logout returns to Sign In and removes the saved session.

Native sessions save the token, user ID, and expiry together using Expo SecureStore.
On startup, the app checks expiry and requests `/profile` with the saved token.
Invalid sessions are cleared. SecureStore availability is checked before use.
Web sessions stay in memory and end on refresh.

Tokens expire after two hours. The server keeps sessions in memory, so restarting
the API invalidates existing sessions and users must sign in again. Keep the API
running when checking session restoration. If logout cannot reach the API, the
app signs out locally and the server token expires automatically.

Physical Android/iOS SecureStore persistence still needs to be checked on a device.
See the [Expo SDK 54 SecureStore documentation](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/).
The remaining `TODO EXAM` records that the instructor did not supply authentication
payload documentation; the local server's payloads are documented above.

### Checks

```sh
npx tsc --noEmit
npm run lint
npm run test:api
```

### Required Git Commits

The `2ndLabExam` branch contains more than five meaningful commits covering
navigation, login, students, details, profile, sessions, and API setup.

### Submission

Repository: https://github.com/jfdr-fkt/CCE106-DelRosario

Exam branch: https://github.com/jfdr-fkt/CCE106-DelRosario/tree/2ndLabExam

Submit the repository URL according to the instructor's instructions and identify
`2ndLabExam` as the examination branch.
