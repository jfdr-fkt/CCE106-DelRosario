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

Base URL: `REPLACE_WITH_EXAM_API` (set in `constants/api.ts`)

You can also set `EXPO_PUBLIC_API_URL` in a local `.env.local` file and restart Expo.

POST /login

GET /students

GET /students/{id}

GET /profile

Use the instructor's API documentation for payloads and response fields.

The instructor's URL and documentation have not been provided yet. The current
code expects these response shapes, which must be checked against that documentation:

- `POST /login`: send `{ "email": "...", "password": "..." }`; receive
  `{ "token": "...", "user": { "id": 1, "name": "...", "email": "...", "role": "..." } }`.
- `GET /students`: receive an array of students with `id`, `name`, `email`, and `course`.
- `GET /students/{id}`: receive one student object, or HTTP 404 when not found.
- `GET /profile`: receive a user object with `id`, `name`, `email`, and `role`.

The GET requests send `Authorization: Bearer TOKEN`. HTTP 401 or 403 signs the
user out. No sample records or hardcoded credentials are used by the app.

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

The remaining `TODO EXAM` comments identify the missing instructor API URL and
response-field confirmation. Set the URL in `constants/api.ts` before logging in.

Expo SecureStore is used only in `context/AuthContext.tsx`. The app checks
availability before saving, reading, or deleting a token. Android/iOS sessions
are restored on startup by validating the saved token with `GET /profile`.
Passwords are never saved. Web sessions stay in memory and end on refresh.
Verify secure session persistence on Android/iOS with the instructor's API.
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
