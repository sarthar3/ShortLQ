const URL = require('../models/URL');
const Analytics = require('../models/Analytics');
const generateShortCode = require('../utils/generateShortCode');
const { validateUrl } = require('../utils/validateUrl');

/**
 * Parse a duration string like "5m", "1h", "1d", "7d", "1mo", "6mo"
 * Returns a Date object or null (meaning no expiry).
 */
const parseDuration = (duration) => {
  if (!duration || duration === 'never') return null;
  const now = new Date();
  const map = {
    '5m':  5 * 60 * 1000,
    '1h':  60 * 60 * 1000,
    '1d':  24 * 60 * 60 * 1000,
    '7d':  7 * 24 * 60 * 60 * 1000,
    '1mo': 30 * 24 * 60 * 60 * 1000,
    '3mo': 90 * 24 * 60 * 60 * 1000,
    '6mo': 180 * 24 * 60 * 60 * 1000,
  };
  if (!map[duration]) return null;
  return new Date(now.getTime() + map[duration]);
};

/**
 * @route   POST /api/urls
 * @desc    Create a shortened URL (with optional expiry)
 * @access  Private
 */
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, expiry } = req.body;
    const userId = req.userId;

    // Validate URL format
    if (!validateUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format. Please provide a valid URL with http:// or https://'
      });
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      shortCode = generateShortCode(6);
      const existingUrl = await URL.findOne({ shortCode });
      if (!existingUrl) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Unable to generate unique short code. Please try again.'
      });
    }

    // Calculate expiry date
    const expiresAt = parseDuration(expiry);

    // Create new URL document
    const url = new URL({
      userId,
      originalUrl,
      shortCode,
      expiresAt
    });

    await url.save();

    res.status(201).json({
      success: true,
      message: 'Short URL created successfully',
      data: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        isExpired: url.isExpired
      }
    });
  } catch (error) {
    console.error('Create short URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating short URL',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/urls
 * @desc    Get all URLs for authenticated user
 * @access  Private
 */
const getUserUrls = async (req, res) => {
  try {
    const userId = req.userId;

    const urls = await URL.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    const now = new Date();

    const urlsWithFullPath = urls.map(url => {
      // Compute real-time expired status (in case cron hasn't run yet)
      const expired = url.isExpired || (url.expiresAt && url.expiresAt < now);
      return {
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        clicks: url.clicks,
        lastVisited: url.lastVisited,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        isExpired: expired
      };
    });

    res.status(200).json({
      success: true,
      count: urls.length,
      data: urlsWithFullPath
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching URLs',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/urls/:id
 * @desc    Delete a URL and its analytics
 * @access  Private
 */
const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const url = await URL.findOne({ _id: id, userId });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found or you do not have permission to delete it'
      });
    }

    await Analytics.deleteMany({ urlId: id });
    await URL.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting URL',
      error: error.message
    });
  }
};

/**
 * @route   GET /:shortCode
 * @desc    Redirect to original URL (with expiry check) and track analytics
 * @access  Public
 */
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await URL.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found'
      });
    }

    // Check expiry
    const now = new Date();
    if (url.isExpired || (url.expiresAt && url.expiresAt < now)) {
      // Mark expired if not already
      if (!url.isExpired) {
        url.isExpired = true;
        await url.save();
      }
      return res.status(410).json({
        success: false,
        message: 'This link has expired and is no longer active'
      });
    }

    // Update click count and last visited
    url.clicks += 1;
    url.lastVisited = now;
    await url.save();

    // Track analytics
    const analytics = new Analytics({
      urlId: url._id,
      userAgent: req.get('user-agent') || '',
      referer: req.get('referer') || '',
      ipAddress: req.ip || req.connection.remoteAddress || ''
    });
    await analytics.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error redirecting to URL',
      error: error.message
    });
  }
};

module.exports = {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  redirectUrl
};
