/**
 * Validate if a string is a proper URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
const validateUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Check if protocol is http or https
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Validate URL using regex pattern
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
const validateUrlRegex = (url) => {
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlPattern.test(url);
};

module.exports = { validateUrl, validateUrlRegex };

// Made with Bob
