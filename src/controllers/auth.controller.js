const authService = require('../services/auth.service');

// REGISTER — create a new user account
async function register(req, res, next) {
  try {
    // req.body already validated by Zod validate() middleware
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err); // AppError flows to errorHandler
  }
}

// LOGIN — returns accessToken + refreshToken
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login(email, password);
    res.status(200).json({ success: true, ...tokens });
    // response: { success: true, accessToken: '...', refreshToken: '...' }
  } catch (err) {
    next(err);
  }
}

// REFRESH — client sends refresh token, gets new access token
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.status(200).json({ success: true, ...result });
    // response: { success: true, accessToken: '...' }
  } catch (err) {
    next(err);
  }
}

// LOGOUT — delete refresh token from DB so it can't be reused
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout };