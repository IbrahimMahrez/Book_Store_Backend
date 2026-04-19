# Book Store Backend (backendreview)

This repository contains a Node.js + Express backend for a small book store application. It uses MongoDB via Mongoose for data storage, provides RESTful endpoints for books, authors and user authentication, and includes utilities for file uploads and password reset flows (EJS views).

---

## Table of Contents
- Project overview
- Quick start
- Environment variables
- Scripts & seeding
- Folder structure
- API reference (endpoints)
- Models overview
- Middlewares
- Views
- Technologies & libraries
- Notes & known issues

---

## Project overview

The app implements:
- CRUD for `Book` and `Author` resources
- User registration and login with JWT authentication
- Protected user endpoints (admin and authorized-user checks)
- Password reset flow using email (nodemailer) and EJS views
- File upload endpoint using `multer`

Static files (images) are served from the `images/` folder. The app uses EJS for a few rendered views used by the password reset flow.

## Quick start

Prerequisites:
- Node.js (v18+ recommended)
- MongoDB instance (local or hosted)

Steps:

1. Clone the repo and install dependencies:

```bash
cd backendreview
npm install
```

2. Create a `.env` file in the project root with the required variables (see below).

3. Start the server:

```bash
node src/server.js
# or use nodemon for development (if installed globally):
nodemon src/server.js
```

By default the server listens on `process.env.PORT` or `3000`.

## Environment variables

Create a `.env` file and set the following keys:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWT tokens
- `EMAIL_USER` — SMTP / Gmail email used for sending password reset
- `EMAIL_PASS` — password (or app password) for the email account
- `PORT` — optional server port

Example `.env` (do NOT commit real secrets):

```
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=you@example.com
EMAIL_PASS=your_email_password
PORT=3000
```

## Scripts & seeding

- There is no `npm start` script defined in the root `package.json` by default — the app entry is `src/server.js`.
- A simple seeder script exists at `seeder.js`. Usage (from project root):

```bash
# Import authors
node seeder.js -a
# or support for flags found in the file: -import-authors, -import-books (see seeder.js)
```

Note: seeder script references project paths — run it from the repository root.

## Folder structure

Top-level layout (important files/folders):

- `src/server.js` — application entry (Express setup, route mounting)
- `config/db.js` — MongoDB connection helper
- `controller/` — route handlers for business logic
- `routes/` — Express routers mounted in `src/server.js`
- `models/` — Mongoose models (`Book`, `Author`, `User`)
- `middlewares/` — `asyncWrapper`, token verification middleware
- `utils/validation.js` — Joi validation helpers
- `images/` — static folder for uploaded images
- `views/` — EJS templates used for password reset flow
- `seeder.js` — script to import seed data from `data/`

## API reference (high level)

Base URL: `http://<host>:<port>`

- `GET /books` — list all books
- `GET /books/:id` — get book by id
- `POST /books` — create a book (expects JSON body with `title`, `author`)
- `PUT /books/:id` — update a book
- `DELETE /books/:id` — delete a book

- `GET /authors` — list authors (supports `?pagenum` query for pagination)
- `GET /authors/:id` — get author by id
- `POST /authors` — create author (admin-only middleware used)
- `PUT /authors/:id` — update author (admin-only)
- `DELETE /authors/:id` — delete author

- `POST /auth/register` — register new user (returns JWT in response header and body)
- `POST /auth/login` — login (returns JWT)

- `GET /users` — list users (admin-only)
- `GET /users/:id` — get a user by id (auth checks)
- `PUT /users/:id` — update user (requires authorization)
- `DELETE /users/:id` — delete user (requires authorization)

- `POST /upload` — upload file (multipart/form-data with `image` field), stores files in `images/`

- `GET /password/forgot_password` & `POST /password/forgot_password` — render/send forgotten password link
- `GET /password/reset_password/:userId/:token` & `POST /password/reset_password/:userId/:token` — reset pages and action

Responses: endpoints generally return JSON. Some password routes render EJS views.

## Models overview

- `Book` (`models/book.js`):
  - `title` (String, required, min 3)
  - `author` (String, required, min 3)

- `Author` (`models/authors.js`):
  - `firstName`, `lastName` (String, required)
  - `age` (Number)

- `User` (`models/user.js`):
  - `username`, `email`, `password`, `isAdmin`
  - Utility validation functions exported and a `generateAuthToken()` instance method

## Middlewares

- `asyncWrapper` — catches async errors and forwards to global error handler
- `verifytoken` & helpers — extracts JWT from `Authorization` header and provides `verifyTokenAndAdmin`, `verifyTokenAndAuthorization` guards used on protected routes

## Views

EJS templates live in `views/` and are used by the password-reset flow:
- `forgot_password.ejs`
- `link_sent.ejs`
- `reset_password.ejs`
- `success-password.ejs`

Static files (uploaded images) are served via `express.static` from the `images/` directory.

## Technologies & libraries

Core technologies:
- Node.js, Express
- MongoDB, Mongoose

Main libraries (from `package.json`):
- `express` — web framework
- `mongoose` — MongoDB ODM
- `dotenv` — environment variables
- `jsonwebtoken` — JWT auth
- `bcrypt` / `bcryptjs` — password hashing
- `joi` — request validation
- `multer` — file uploads
- `nodemailer` — sending password reset emails
- `ejs` — server-side templates for a few views
- `cors`, `helmet` — security and CORS handling
- `validator` — extra validation helpers

Dev / tooling:
- `nodemon` — development file watcher

## Notes & known issues

- Some controller files contain inconsistent imports or minor issues (for example `authorscontroll.js` requires `../models/book` instead of the `Author` model). Review controllers for correct model imports before production.
- The seeder script uses CLI flags; ensure you run it from the repo root and check paths if it errors.
- No automated tests are included.

## Next steps / suggestions

- Add `npm` scripts and a `dev` script for easier runs.
- Add integration tests for API endpoints and validation checks.
- Harden auth token handling (longer expiry, refresh tokens if required) and secure email credentials via secrets manager in production.


