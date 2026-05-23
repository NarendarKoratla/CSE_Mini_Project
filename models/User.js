const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    year: { type: String, required: true },
    course: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
