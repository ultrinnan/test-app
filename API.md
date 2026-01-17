# API Documentation

## Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** `/api` (relative to frontend)

## Authentication Endpoints

### Register User

**POST** `/api/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar": null
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `400 Bad Request` - User already exists
- `500 Internal Server Error` - Server error

---

### Login

**POST** `/api/login`

Authenticate a user and return user data.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar": null
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

## User Management Endpoints

### Get Users (Paginated)

**GET** `/api/users?page=1`

Retrieve a paginated list of users.

**Query Parameters:**
- `page` (number, default: 1) - Page number

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "avatar": null
    }
  ],
  "page": 1,
  "per_page": 6,
  "total": 50,
  "total_pages": 9
}
```

**Error Responses:**
- `500 Internal Server Error` - Server error

---

### Get User by ID

**GET** `/api/users/:id`

Retrieve a specific user by ID.

**Path Parameters:**
- `id` (number) - User ID

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar": null
  }
}
```

**Error Responses:**
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### Create User

**POST** `/api/users`

Create a new user (admin function).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 51,
    "email": "newuser@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "avatar": null
  }
}
```

**Error Responses:**
- `400 Bad Request` - Email is required
- `400 Bad Request` - User already exists
- `500 Internal Server Error` - Server error

---

### Update User

**PUT** `/api/users/:id`

Update an existing user.

**Path Parameters:**
- `id` (number) - User ID

**Request Body:**
```json
{
  "email": "updated@example.com",
  "first_name": "Updated",
  "last_name": "Name"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "updated@example.com",
    "first_name": "Updated",
    "last_name": "Name",
    "avatar": null
  }
}
```

**Error Responses:**
- `400 Bad Request` - Email is required
- `400 Bad Request` - User already exists (if email changed to existing email)
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### Delete User

**DELETE** `/api/users/:id`

Delete a user by ID.

**Path Parameters:**
- `id` (number) - User ID

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

## Notes

- All endpoints return JSON
- Content-Type header should be `application/json`
- Passwords are stored in plain text (for demo purposes only - use hashing in production)
- Pagination defaults to 6 users per page
- User IDs are auto-incremented integers
