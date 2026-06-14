const cron = require('node-cron');
const URL = require('../models/URL');
const Analytics = require('../models/Analytics');

/**
 * Delete URLs that are:
 *  - Past their expiresAt date, OR
 *  - Haven't been visited in 6 months (inactive cleanup)
 *
 * Also deletes all associated analytics.
 */
const runCleanup = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const now = new Date();

    // Find URLs to delete:
    // 1. Has expiresAt set and it's in the past
    // 2. lastVisited is older than 6 months ago
    // 3. Never visited and created more than 6 months ago
    const urlsToDelete = await URL.find({
      $or: [
        { expiresAt: { $lt: now, $ne: null } },
        { lastVisited: { $lt: sixMonthsAgo } },
        { lastVisited: null, createdAt: { $lt: sixMonthsAgo } }
      ]
    }).select('_id');

    if (urlsToDelete.length === 0) {
      console.log('[Cleanup] No stale URLs found.');
      return;
    }

    const urlIds = urlsToDelete.map(u => u._id);

    // Delete analytics first (foreign key dependency)
    const analyticsResult = await Analytics.deleteMany({ urlId: { $in: urlIds } });
    // Delete URLs
    const urlResult = await URL.deleteMany({ _id: { $in: urlIds } });

    console.log(`[Cleanup] Removed ${urlResult.deletedCount} stale URLs and ${analyticsResult.deletedCount} analytics records.`);
  } catch (error) {
    console.error('[Cleanup] Error during cleanup job:', error.message);
  }
};

/**
 * Schedule cleanup to run every day at 2:00 AM
 */
const startCleanupJob = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cleanup] Running scheduled cleanup job...');
    await runCleanup();
  });
  console.log('[Cleanup] Scheduled daily cleanup job at 2:00 AM');
};

module.exports = { runCleanup, startCleanupJob };
