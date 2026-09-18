/**
 * Async handler wrapper to eliminate try-catch blocks
 * Usage: exports.myController = asyncHandler(async (req, res) => { ... })
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
