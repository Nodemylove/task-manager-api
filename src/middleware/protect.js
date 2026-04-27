const jwt    = require('jsonwebtoken');
const config = require('../config/config');

function protect(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // attach payload — controllers use req.user.userId
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = protect;