const config = require('../config/config');

// 4 params = Express knows this is an error handler
// MUST be the last app.use() in app.js
function errorHandler(err, req, res, next) {
  console.error(`[ERROR TYPE] ${err.constructor.name}`);
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || err.status || 500;

  // development: show full stack trace for debugging
  // production: never expose internals to clients
  if (config.isDev) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack:   err.stack,
    });
  }

  // production: only show message if we threw it intentionally
  const message = err.isOperational
    ? err.message
    : 'Something went wrong on the server';

  res.status(statusCode).json({ success: false, message });
}

module.exports = errorHandler;