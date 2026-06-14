const express = require('express');
const router = express.Router();
const { getUrlAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// @route   GET /api/analytics/:urlId
// @desc    Get analytics for a specific URL
// @access  Private
router.get('/:urlId', auth, getUrlAnalytics);

module.exports = router;

// Made with Bob
