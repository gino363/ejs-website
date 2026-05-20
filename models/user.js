
// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,   // No two users with the same username
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,   // No duplicates
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', UserSchema);
