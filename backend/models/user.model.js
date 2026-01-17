const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  summary: { type: String },
  keyInsights: { type: mongoose.Schema.Types.Mixed }, 
  currentMood: { type: String },
  gentleSuggestion: { type: String },
});

// --- ADD: Schema for individual diary entries ---
const diaryEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  nickname: { type: String },
  ageGroup: { type: String },
  gender: { type: String },
  situation: { type: String },
  expectation: { type: String },
  ethnicity: { type: String },
  summaries: [summarySchema],
  // --- ADD: Array to store diary entries ---
  diaryEntries: [diaryEntrySchema], 
  hasCompletedQuestionnaire: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

