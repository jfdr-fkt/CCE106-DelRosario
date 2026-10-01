# CCE106 Practical Laboratory Examination

## Student Service Portal

### Student Information

Name:

Section:

Date:

### Required Features

- [ ] Login
- [ ] Authentication state
- [ ] Secure token storage
- [ ] Protected navigation
- [ ] Dashboard
- [ ] Student API request
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Search/filter
- [ ] Dynamic student details
- [ ] Profile
- [ ] Session restoration
- [ ] Logout

### API

Base URL: `https://jsonplaceholder.typicode.com` (set in `constants/api.ts`)

You can also set `EXPO_PUBLIC_API_URL` in a local `.env.local` file and restart Expo.

The instructor supplied [JSONPlaceholder](https://jsonplaceholder.typicode.com/).
It provides public `/users` records, but does not provide the starter's
`POST /login`, `GET /students`, `GET /students/{id}`, or `GET /profile` endpoints.
The app uses these working endpoints instead:

| Feature | Request |
| --- | --- |
| Demo login | `GET /users`, then find the entered email |
| Student list | `GET /users` |
| Student details | `GET /users/{id}` |
| Profile and session restoration | `GET /users/{signed-in user id}` |

Records come from the supplied API. The screens display its name, email,
username, phone, city, and company fields. No course or role data is invented.

### Demo Login

Use `Sincere@april.biz` with any non-empty demo password. Other emails returned
by `/users` also work, and email matching is case-insensitive.

JSONPlaceholder cannot verify passwords or issue authentication tokens. The
app therefore generates a random local session ID with Expo Crypto. This is
a demo session, not server authentication. Passwords are neither saved nor
sent to JSONPlaceholder. The demo session ID is not sent as an API credential.
The original server-authentication endpoints remain unsupported by this service.

### How to Run

```sh
npm install
npx expo start
```

Press `w` for web, or run `npm run web` directly.

The app opens Sign In. After login, it displays the dashboard, students, and profile.
Both the application tabs and `/student/{id}` require authentication. The student
list supports searching by name, and View Details opens the selected student's
dynamic route. API screens show loading, error, and empty states, with a retry
button for errors. Logout returns to Sign In.

The remaining `TODO EXAM` in `constants/api.ts` records the original endpoint
requirements, which JSONPlaceholder cannot satisfy. The implemented demo uses
the endpoint mapping above.

Expo SecureStore is used only in `context/AuthContext.tsx`. The app checks
availability before saving, reading, or deleting a session. Android/iOS sessions
store the session ID, user ID, and expiry together. On startup, the app checks
the saved expiry and fetches the user from `/users/{id}`. Saved sessions expire
after 24 hours. Invalid sessions and deleted users are signed out. Passwords
are never saved. Web sessions stay in memory and end on refresh.
SecureStore persistence still needs to be verified on a physical Android/iOS device.
See the [Expo SDK 54 SecureStore documentation](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/).

Compiler and lint checks:

```sh
npx tsc --noEmit
npm run lint
```

### Required Git Commits

Students must create at least five meaningful commits.

Suggested examples:

- `exam: setup navigation`
- `exam: implement login`
- `exam: integrate student api`
- `exam: add dynamic student details`
- `exam: implement session and logout`

### Submission

Submit the GitHub repository URL according to the instructor's instructions.
