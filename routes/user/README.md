# User routes

Base path: `/v1/user`

Signup is a two-step flow: first the user signs up and receives an OTP by email; then they submit the OTP to complete registration.

---

## POST `/signup`

Step 1: Submits name, email, and password. An OTP is sent to the given email (email sending is TODO; in development the OTP is logged to the server console). The user must then call **POST `/verify-otp`** with the same email and the OTP received.

### Input

**Content-Type:** `application/json`

**Body:**

| Field      | Type   | Required | Constraints           | Description   |
| ---------- | ------ | -------- | --------------------- | ------------- |
| `name`     | string | yes      | Minimum 1 character   | User name     |
| `email`    | string | yes      | Must be a valid email | User email    |
| `password` | string | yes      | Minimum 8 characters  | User password |

**Example:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass123"
}
```

### Output

**Success (200)**

- Request body is valid; OTP has been generated and (when implemented) sent to the email. User should check email and then call **POST `/verify-otp`**.

```json
{
  "success": true,
  "message": "Signup initiated. Check your email for the OTP to complete registration."
}
```

**Invalid request (500)**

- Missing/invalid body, validation failure (e.g. invalid email, password &lt; 8 chars, empty name), or server error.

```json
{
  "success": false,
  "message": "Invalid request"
}
```

---

## POST `/verify-otp`

Step 2: Submits the email used in signup and the 6-digit OTP received by email. If valid, the account is created and the signup flow is complete.

### Input

**Content-Type:** `application/json`

**Body:**

| Field   | Type   | Required | Constraints           | Description                  |
| ------- | ------ | -------- | --------------------- | ---------------------------- |
| `email` | string | yes      | Must be a valid email | Same email used in `/signup` |
| `otp`   | string | yes      | Exactly 6 characters  | OTP received in email        |

**Example:**

```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```

### Output

**Success (200)**

- OTP is valid and not expired; user record is created (DB persistence is TODO).

```json
{
  "success": true,
  "message": "Email verified. Account created successfully."
}
```

**No signup found (400)**

- No pending signup for this email (user must call **POST `/signup`** first).

```json
{
  "success": false,
  "message": "No signup found for this email. Please sign up first."
}
```

**OTP expired (400)**

- Pending signup exists but OTP has expired (e.g. after 10 minutes). User must sign up again.

```json
{
  "success": false,
  "message": "OTP expired. Please sign up again."
}
```

**Invalid OTP (401)**

- OTP does not match the one sent for this email.

```json
{
  "success": false,
  "message": "Invalid OTP."
}
```

**Invalid request (500)**

- Missing/invalid body, validation failure (e.g. invalid email, OTP not 6 chars), or server error.

```json
{
  "success": false,
  "message": "Invalid request"
}
```
