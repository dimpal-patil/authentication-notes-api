# Notes API

A RESTful Notes API built with **Node.js, Express, MongoDB, and Mongoose**. The application uses JWT authentication to ensure that users can only access and manage their own notes.

## Features

* User registration
* User login with JWT authentication
* Create notes
* Get notes belonging to the authenticated user
* Get a single note with ownership verification
* Update only your own notes
* Delete only your own notes
* MongoDB database with Mongoose
* Protected API routes

## Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcrypt
* dotenv
* Morgan

## Project Structure

```text
project/
│
├── config/
│   └── db-connection.js
│
├── controllers/
│   ├── note-controller.js
│   └── user-controller.js
│
├── middleware/
│   ├── adminOnly.js
│   └── verifyAuthentication.js
│
├── models/
│   ├── note-model.js
│   └── user-model.js
│
├── routes/
│   ├── api/
│   │   └── notes.js
│   └── user-routes.js
│
├── public/
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

# Getting Started

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

## 2. Navigate to the Project

```bash
cd YOUR_PROJECT_FOLDER
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_KEY=your_secret_key
```

Make sure `.env` is included in `.gitignore`:

```text
node_modules/
.env
```

## 5. Start the Server

Run the application with:

```bash
node server.js
```

For development, if your project has a `dev` script:

```bash
npm run dev
```

The server will run at:

```text
http://localhost:3000
```

# User Authentication API

User registration and login are available through the `/api/auth` routes.

## Register User

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

A new user is created and the password is securely hashed before being stored.

## Login User

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

A successful login returns a JWT token.

Use the returned token when accessing protected Notes API routes.

In Postman:

```text
Authorization → Bearer Token
```

Paste the JWT token into the Token field.

## User API Summary

| Method | Endpoint             | Authentication | Description           |
| ------ | -------------------- | -------------- | --------------------- |
| `POST` | `/api/auth/register` | No             | Register a new user   |
| `POST` | `/api/auth/login`    | No             | Login and receive JWT |

# Notes API

All Notes API routes require a valid JWT.

The authenticated user's ID is available through:

```js
req.user._id
```

## Create Note

```http
POST /api/notes
```

Example request:

```json
{
  "title": "Grocery List",
  "content": "Buy milk, eggs, spinach, bananas, and rice."
}
```

The user ID is automatically assigned to the note:

```js
user: req.user._id
```

You do **not** need to send the `user` field in the request body.

## Get All My Notes

```http
GET /api/notes
```

Returns only notes belonging to the currently authenticated user.

The controller filters notes using:

```js
Note.find({
    user: req.user._id
});
```

## Get Single Note

```http
GET /api/notes/:id
```

Returns a single note only if the authenticated user owns it.

If the note belongs to another user, the API returns:

```http
403 Forbidden
```

## Update Note

```http
PUT /api/notes/:id
```

Example request:

```json
{
  "title": "Updated Grocery List",
  "content": "Buy milk, eggs, spinach, bananas, rice, and bread."
}
```

Before updating, the API:

1. Finds the note by its ID.
2. Checks whether the authenticated user owns the note.
3. Updates the note if the user is the owner.
4. Returns `403 Forbidden` if the user is not the owner.

Unauthorized response:

```json
{
  "message": "User is not authorized to update this note."
}
```

## Delete Note

```http
DELETE /api/notes/:id
```

Before deleting, the API:

1. Finds the note by its ID.
2. Checks whether the authenticated user owns the note.
3. Deletes the note if the user is the owner.
4. Returns `403 Forbidden` if the user is not the owner.

Unauthorized response:

```json
{
  "message": "User is not authorized to delete this note."
}
```

# Notes API Summary

| Method   | Endpoint         | Authentication | Description                    |
| -------- | ---------------- | -------------- | ------------------------------ |
| `POST`   | `/api/notes`     | Yes            | Create a note                  |
| `GET`    | `/api/notes`     | Yes            | Get the logged-in user's notes |
| `GET`    | `/api/notes/:id` | Yes            | Get one owned note             |
| `PUT`    | `/api/notes/:id` | Yes            | Update an owned note           |
| `DELETE` | `/api/notes/:id` | Yes            | Delete an owned note           |

# Note Model

Each note is associated with a user using a MongoDB ObjectId reference:

```js
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
```

This relationship allows the API to determine which user owns each note.

# Authentication Flow

```text
Register
   ↓
Login
   ↓
JWT Token
   ↓
Authorization: Bearer <token>
   ↓
verifyAuthentication middleware
   ↓
req.user
   ↓
Notes Controller
   ↓
User-specific Notes
```

# Testing with Postman

Recommended testing sequence:

### 1. Register

```http
POST http://localhost:3000/api/auth/register
```

### 2. Login

```http
POST http://localhost:3000/api/auth/login
```

Copy the JWT returned from the login response.

### 3. Add JWT

For protected Notes requests:

```text
Authorization
Type: Bearer Token
Token: YOUR_JWT_TOKEN
```

### 4. Create a Note

```http
POST http://localhost:3000/api/notes
```

### 5. Get Your Notes

```http
GET http://localhost:3000/api/notes
```

### 6. Get One Note

```http
GET http://localhost:3000/api/notes/:id
```

### 7. Update a Note

```http
PUT http://localhost:3000/api/notes/:id
```

### 8. Delete a Note

```http
DELETE http://localhost:3000/api/notes/:id
```

### 9. Test Ownership

Create a second user and log in with that user's account.

Try to access, update, or delete the first user's note.

The API should prevent unauthorized access and modification with a `403 Forbidden` response.

# Error Responses

### 401 Unauthorized

Returned when the JWT is missing or invalid.

### 403 Forbidden

Returned when an authenticated user tries to access or modify a note they do not own.

### 404 Not Found

Returned when the requested note does not exist.

### 500 Internal Server Error

Returned when an unexpected server or database error occurs.


