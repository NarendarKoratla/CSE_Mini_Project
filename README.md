# Online Faculty Feedback Form

A student-facing web application for submitting faculty feedback and viewing aggregated results by teacher and year/course. The project uses a vanilla HTML/CSS/JavaScript frontend with an Express server and MongoDB persistence.

> **Security status:** Passwords are now hashed with Node.js scrypt for new registrations. Existing legacy plaintext passwords are upgraded to hashes after a successful login. This is still an educational prototype and is **not production-ready**: feedback submission and results access still need proper authenticated sessions/tokens, server-side authorization, abuse protection, and a privacy review.

## Features
- Student registration and login flow.
- Feedback submission for multiple teachers.
- MongoDB persistence through Mongoose.
- Aggregated average ratings and feedback counts by teacher.
- Suggestions included with aggregated results.
- Frontend built with HTML, CSS, and JavaScript.

## Technology
- Node.js
- Express
- MongoDB with Mongoose
- dotenv
- HTML, CSS, and JavaScript

## Run locally

### Prerequisites
- Node.js and npm
- MongoDB (local instance or MongoDB Atlas)

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
Keep `.env` private and ensure it is ignored by Git. Never commit database credentials.

### 4. Start the server
```bash
npm start
```
Open `http://localhost:5000` after the server starts and the database connection succeeds.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/register` | Register a student account |
| POST | `/api/login` | Validate login details |
| POST | `/api/feedback` | Submit feedback entries |
| GET | `/api/results/:yearCourse` | Return aggregated results for a year/course |

## Production-readiness checklist
- Add session or token-based authentication and verify identity on feedback submissions.
- Authorize access to feedback/results on the server rather than trusting a client-supplied user ID.
- Review whether suggestions should be included in results and how anonymous feedback privacy is protected.
- Configure an explicit allowed-origin list for CORS if cross-origin requests are needed.
- Add rate limiting, automated tests, and deployment configuration.
- Test the frontend against the updated server before using real accounts or feedback.

## Author
**Narendar Koratla** · [GitHub](https://github.com/NarendarKoratla) · [LinkedIn](https://www.linkedin.com/in/narendar-koratla-63569b384/)
