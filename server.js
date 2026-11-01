require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);
const User = require('./models/User');
const Feedback = require('./models/Feedback');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const PASSWORD_PREFIX = 'scrypt';
const PASSWORD_KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, PASSWORD_KEY_LENGTH);
  return `${PASSWORD_PREFIX}$${salt}$${key.toString('hex')}`;
}

async function verifyPassword(password, storedValue) {
  if (typeof storedValue !== 'string') return { valid: false, needsUpgrade: false };

  // Support legacy plaintext records only to allow a successful login to migrate
  // the password to a salted scrypt hash. New registrations are always hashed.
  if (!storedValue.startsWith(`${PASSWORD_PREFIX}$`)) {
    return { valid: password === storedValue, needsUpgrade: password === storedValue };
  }

  const parts = storedValue.split('$');
  if (parts.length !== 3 || !parts[1] || !/^[a-f0-9]+$/i.test(parts[2])) {
    return { valid: false, needsUpgrade: false };
  }

  try {
    const expected = Buffer.from(parts[2], 'hex');
    const actual = Buffer.from(await scrypt(password, parts[1], expected.length));
    return {
      valid: expected.length === actual.length && crypto.timingSafeEqual(expected, actual),
      needsUpgrade: false
    };
  } catch {
    return { valid: false, needsUpgrade: false };
  }
}

function validText(value, maxLength = 200) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, studentName, email, dob, year, course } = req.body || {};
    if (![username, studentName, email, year, course].every(v => validText(v)) ||
        typeof password !== 'string' || password.length < 8 || password.length > 128 ||
        !dob || Number.isNaN(Date.parse(dob))) {
      return res.status(400).json({
        message: 'Provide valid registration details. Password must be 8–128 characters.'
      });
    }

    const normalizedUsername = username.trim();
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = new User({
      username: normalizedUsername,
      password: await hashPassword(password),
      studentName: studentName.trim(),
      email: email.trim(),
      dob,
      year: year.trim(),
      course: course.trim()
    });
    await newUser.save();
    return res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    console.error('Registration failed:', err.message);
    return res.status(500).json({ message: 'Unable to register at this time' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!validText(username) || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim() });
    const check = user
      ? await verifyPassword(password, user.password)
      : { valid: false, needsUpgrade: false };

    if (!user || !check.valid) {
      return res.status(401).json({ message: 'Username or password is incorrect' });
    }

    if (check.needsUpgrade) {
      user.password = await hashPassword(password);
      await user.save();
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        studentName: user.studentName,
        year: user.year,
        course: user.course
      }
    });
  } catch (err) {
    console.error('Login failed:', err.message);
    return res.status(500).json({ message: 'Unable to log in at this time' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { teacherData, userId, yearCourse } = req.body || {};
    if (!Array.isArray(teacherData) || teacherData.length === 0 || teacherData.length > 100 ||
        !validText(yearCourse) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid feedback submission' });
    }

    const feedbacksToSave = [];
    for (const data of teacherData) {
      if (!data || !validText(data.teacher) ||
          ![data.interaction, data.subject, data.examples, data.explanation]
            .every(value => Number.isInteger(value) && value >= 1 && value <= 5)) {
        return res.status(400).json({ message: 'Each feedback rating must be an integer from 1 to 5' });
      }

      const ratings = [data.interaction, data.subject, data.examples, data.explanation];
      feedbacksToSave.push({
        teacher: data.teacher.trim(),
        yearCourse: yearCourse.trim(),
        interaction: ratings[0],
        subject: ratings[1],
        examples: ratings[2],
        explanation: ratings[3],
        totalRating: ratings.reduce((sum, value) => sum + value, 0) / ratings.length,
        suggestion: typeof data.suggestion === 'string' ? data.suggestion.slice(0, 2000) : '',
        submittedBy: userId
      });
    }

    await Feedback.insertMany(feedbacksToSave);
    return res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback submission failed:', err.message);
    return res.status(500).json({ message: 'Unable to submit feedback at this time' });
  }
});

app.get('/api/results/:yearCourse', async (req, res) => {
  try {
    const yearCourse = req.params.yearCourse;
    if (!validText(yearCourse, 200)) {
      return res.status(400).json({ message: 'Invalid year/course' });
    }

    const results = await Feedback.aggregate([
      { $match: { yearCourse } },
      {
        $group: {
          _id: '$teacher',
          avgTotalRating: { $avg: '$totalRating' },
          feedbacksCount: { $sum: 1 },
          suggestions: { $push: '$suggestion' }
        }
      },
      { $sort: { avgTotalRating: -1 } }
    ]);

    return res.status(200).json(results);
  } catch (err) {
    console.error('Fetching results failed:', err.message);
    return res.status(500).json({ message: 'Unable to fetch results at this time' });
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
