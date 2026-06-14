const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'URL',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String,
    default: ''
  },
  referer: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  }
});

// Index for faster queries
analyticsSchema.index({ urlId: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);

// Made with Bob
