require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Models
const User = require('./models/User');
const Feedback = require('./models/Feedback');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

// 1. Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, studentName, email, dob, year, course } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ username, password, studentName, email, dob, year, course });
        await newUser.save();
        res.status(201).json({ message: 'Registered Successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        
        if (user) {
            // Return user details without password
            res.status(200).json({ 
                message: 'Login Successful',
                user: {
                    id: user._id,
                    username: user.username,
                    studentName: user.studentName,
                    year: user.year,
                    course: user.course
                }
            });
        } else {
            res.status(401).json({ message: "Username or Password doesn't match" });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});

// 3. Submit Feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { teacherData, suggestion, userId, yearCourse } = req.body;
        
        const feedbacksToSave = teacherData.map(data => ({
            teacher: data.teacher,
            yearCourse: yearCourse,
            interaction: data.interaction,
            subject: data.subject,
            examples: data.examples,
            explanation: data.explanation,
            totalRating: data.totalRating,
            suggestion: data.suggestion,
            submittedBy: userId
        }));

        await Feedback.insertMany(feedbacksToSave);
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting feedback', error: err.message });
    }
});

// 4. Get Aggregated Results
app.get('/api/results/:yearCourse', async (req, res) => {
    try {
        const { yearCourse } = req.params;
        
        // Aggregate feedbacks for the specific yearCourse
        const results = await Feedback.aggregate([
            { $match: { yearCourse: yearCourse } },
            { 
                $group: {
                    _id: "$teacher",
                    avgTotalRating: { $avg: "$totalRating" },
                    feedbacksCount: { $sum: 1 },
                    suggestions: { $push: "$suggestion" }
                }
            },
            { $sort: { avgTotalRating: -1 } }
        ]);

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching results', error: err.message });
    }
});

// No catch-all route needed for this simple app since express.static handles index.html

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
