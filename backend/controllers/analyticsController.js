const Analytics = require('../models/Analytics');
const URL = require('../models/URL');

/**
 * @route   GET /api/analytics/:urlId
 * @desc    Get analytics for a specific URL
 * @access  Private
 */
const getUrlAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;
    const userId = req.userId;

    // Verify URL belongs to user
    const url = await URL.findOne({ _id: urlId, userId });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found or you do not have permission to view its analytics'
      });
    }

    // Get analytics data
    const analytics = await Analytics.find({ urlId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('-__v');

    // Get total clicks
    const totalClicks = url.clicks;

    // Get last visited time
    const lastVisited = url.lastVisited;

    // Format recent visits
    const recentVisits = analytics.map(visit => ({
      timestamp: visit.timestamp,
      userAgent: visit.userAgent,
      referer: visit.referer || 'Direct'
    }));

    res.status(200).json({
      success: true,
      data: {
        urlId: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        totalClicks,
        lastVisited,
        recentVisits
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

module.exports = {
  getUrlAnalytics
};

// Made with Bob
