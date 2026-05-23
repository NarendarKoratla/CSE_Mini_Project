const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    teacher: { type: String, required: true },
    yearCourse: { type: String, required: true },
    interaction: { type: Number, required: true, min: 1, max: 5 },
    subject: { type: Number, required: true, min: 1, max: 5 },
    examples: { type: Number, required: true, min: 1, max: 5 },
    explanation: { type: Number, required: true, min: 1, max: 5 },
    totalRating: { type: Number, required: true },
    suggestion: { type: String },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
