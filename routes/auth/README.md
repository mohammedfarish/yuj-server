# Auth routes

Base path: `/v1/auth`

---

## POST `/login`

Authenticates a user with email and password.

### Input

**Content-Type:** `application/json`

**Body:**

| Field      | Type   | Required | Constraints           | Description   |
| ---------- | ------ | -------- | --------------------- | ------------- |
| `email`    | string | yes      | Must be a valid email | User email    |
| `password` | string | yes      | Minimum 8 characters  | User password |

**Example:**

```json
{
  "email": "test@test.com",
  "password": "password"
}
```

### Output

**Success (200)**

- Credentials match the expected values.

```json
{
  "success": true,
  "message": "Login successful"
}
```

**Invalid credentials (401)**

- Email or password does not match.

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Invalid request (500)**

- Missing/invalid body, validation failure (e.g. invalid email, password &lt; 8 chars), or server error.

```json
{
  "success": false,
  "message": "Invalid request"
}
```

---

## POST `/logout`

Ends the current session (or signals the client to clear tokens). No request body required.

### Input

None. Optional `Content-Type: application/json` and empty body `{}` are accepted.

### Output

**Success (200)**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
