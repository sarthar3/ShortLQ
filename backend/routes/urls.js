const express = require('express');
const router = express.Router();
const { createShortUrl, getUserUrls, deleteUrl } = require('../controllers/urlController');
const auth = require('../middleware/auth');
const { urlValidation, validate } = require('../middleware/validation');

// @route   POST /api/urls
// @desc    Create a shortened URL
// @access  Private
router.post('/', auth, urlValidation, validate, createShortUrl);

// @route   GET /api/urls
// @desc    Get all URLs for authenticated user
// @access  Private
router.get('/', auth, getUserUrls);

// @route   DELETE /api/urls/:id
// @desc    Delete a URL
// @access  Private
router.delete('/:id', auth, deleteUrl);

module.exports = router;

// Made with Bob
