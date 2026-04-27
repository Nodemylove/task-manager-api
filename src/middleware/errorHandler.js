const config = require('../config/config');

function errorHandler(err, req, res, next) {
  console.error('[ERROR TYPE]', err.constructor.name);
  console.error('[ERROR]', err.message);
  console.error('[IS OPERATIONAL]', err.isOperational);

  const statusCode = err.statusCode || err.status || 500;

  // Development mode response
  if (config.isDev) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production mode response
  const message = err.isOperational
    ? err.message
    : 'Something went wrong on server';

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;