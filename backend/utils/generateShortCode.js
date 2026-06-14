const crypto = require('crypto');

/**
 * Generate a unique short code for URL shortening
 * @param {number} length - Length of the short code (default: 6)
 * @returns {string} - Random alphanumeric short code
 */
const generateShortCode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  
  // Use crypto for better randomness
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % characters.length;
    shortCode += characters[randomIndex];
  }
  
  return shortCode;
};

module.exports = generateShortCode;

// Made with Bob
