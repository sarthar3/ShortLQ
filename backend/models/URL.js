const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastVisited: {
    type: Date,
    default: null
  },
  // Optional expiry set by user (null = never expires)
  expiresAt: {
    type: Date,
    default: null
  },
  // Marked true when expired — also set by cleanup cron
  isExpired: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster lookups
urlSchema.index({ shortCode: 1 });
urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ expiresAt: 1 });       // for expiry queries
urlSchema.index({ lastVisited: 1 });     // for inactive cleanup

module.exports = mongoose.model('URL', urlSchema);
