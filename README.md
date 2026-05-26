# Faculty Feedback Form

A web application for collecting anonymous faculty feedback from students. It stores feedback in MongoDB and provides aggregated results per teacher.

## ✨ Features
- **User Registration & Login** – simple username/password accounts.
- **Submit Feedback** – add multiple teachers in one form, rate, and give suggestions.
- **Aggregated Results** – view average rating, total reviews, and recent suggestions per teacher.
- **Responsive UI** – glass‑morphism styled interface using vanilla HTML/CSS/JS.
- **REST API** – Express endpoints for register, login, feedback submission, and result aggregation.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **Frontend**: HTML + CSS + JavaScript (no framework)
- **Styling**: Google Font *Inter*, glass‑morphism cards, subtle micro‑animations
- **Environment**: `dotenv` for configuration (`MONGO_URI`, `PORT`)

## 🚀 Getting Started
### Prerequisites
- Node.js (v14+)
- npm
- MongoDB instance (local or Atlas)

### Installation
```bash
# Clone the repo
git clone https://github.com/NarendarKoratla/CSE_Mini_Project.git
cd CSE_Mini_Project

# Install dependencies
npm install

# Create .env (see .env.example)
cp .env.example .env   # then edit with your MongoDB URI
```

### Running the app
```bash
npm start   # server runs on http://localhost:5000
```
Open the URL in your browser to see the login/registration flow, submit feedback, and view aggregated results.

## 📡 API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | Register a new user (username, password, student info) |
| POST | `/api/login` | Authenticate user, returns user data (no password) |
| POST | `/api/feedback` | Submit an array of teacher feedback objects |
| GET | `/api/results/:yearCourse` | Aggregated results for a specific year‑course (average rating, count, suggestions) |

## 📂 Project Structure
```
CSE_Mini_Project/
├─ .env                # local config (ignored in git)
├─ .gitignore          # node_modules, .env
├─ models/
│   ├─ User.js        # Mongoose schema for users
│   └─ Feedback.js    # Mongoose schema for feedback entries
├─ public/
│   ├─ index.html     # UI entry point
│   ├─ script.js      # client‑side fetch logic
│   └─ styles.css     # glass‑morphism styling
├─ server.js           # Express server & routes
├─ package.json
└─ README.md           # **this file**
```

## 🎨 Styling Notes
- Uses a subtle glass‑morphism effect (`backdrop-filter: blur(10px)`) for cards.
- Hover states on buttons transition smoothly (`transition: background 0.3s`).
- Responsive layout adapts to mobile via CSS grid.

## 📄 License
MIT – feel free to fork, improve, and use in your projects.

---
*Repository created by Narendar Koratla.*
