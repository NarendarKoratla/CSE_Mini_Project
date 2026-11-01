# Online Faculty Feedback Form

A student-facing web application for submitting faculty feedback and viewing aggregated results by teacher and year/course. The project uses a simple HTML/CSS/JavaScript frontend with an Express server and MongoDB persistence.

> **Security note:** This repository is an educational prototype. The current login implementation compares stored passwords directly and does not hash them. Do not deploy it with real student accounts or sensitive feedback until authentication, authorization, validation, and privacy protections have been reviewed and fixed.

## Features

- Student registration and login flow.
- Feedback submission for multiple teachers.
- Stores feedback records in MongoDB.
- Aggregates average ratings and feedback counts by teacher.
- Displays suggestions alongside aggregated results.
- Responsive interface built with vanilla HTML, CSS, and JavaScript.

## Technology

- Node.js
- Express
- MongoDB with Mongoose
- dotenv for environment configuration
- HTML, CSS, and JavaScript

## Run locally

### Prerequisites

- Node.js and npm
- A MongoDB instance (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/NarendarKoratla/CSE_Mini_Project.git
cd CSE_Mini_Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Create a `.env` file in the project root:

```dotenv
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Keep `.env` private and ensure it is ignored by Git. Do not commit database credentials.

### 4. Start the server

```bash
npm start
```

Open `http://localhost:5000` in your browser after the server starts and the MongoDB connection succeeds.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/register` | Create a student account |
| POST | `/api/login` | Validate login details |
| POST | `/api/feedback` | Submit feedback entries |
| GET | `/api/results/:yearCourse` | Return aggregated results for a year/course |

## Before production use

The current source should be treated as a learning prototype. Recommended follow-up work includes password hashing, session or token-based authentication, server-side authorization, request validation, rate limiting, restricted CORS settings, and a privacy review for anonymous feedback. Verify that users cannot access results or submit data beyond their intended permissions.

## Author

**Narendar Koratla** · [GitHub](https://github.com/NarendarKoratla) · [LinkedIn](https://www.linkedin.com/in/narendar-koratla-63569b384/)
