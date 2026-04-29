const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken');
const config=require('../config/config');
const AppError=require('../utils/AppError');
const userQ=require('../queries/user.queries');
const db =require('../db/knex');

// ── REGISTER ─────────────────────────────────────────────────
async function register(email, password) {

  // step 1: check if email already taken
  const existing = await userQ.findByEmail(email);
  if (existing) throw new AppError('Email already registered', 409);

  // step 2: hash password MANUALLY — no pre-save hook in Knex
  // 10 = salt rounds — higher is more secure but slower
  const hashed = await bcrypt.hash(password, 10);

  // step 3: insert new user — pass hashed password to query
  const user = await userQ.createUser(email, hashed);

  // return safe fields only — never return the hashed password
  return user; 
}


// ── LOGIN ─────────────────────────────────────────────────────
async function login(email, password) {

  // step 1: find user by email
  // findByEmail returns the full row including password hash
  const user = await userQ.findByEmail(email);

  // same message for wrong email AND wrong password
  // never tell attacker which one failed
  if (!user) throw new AppError('Invalid credentials', 401);

  // step 2: compare plain password with stored hash
  // bcrypt.compare handles the salt automatically
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401);

  // step 3: sign short-lived ACCESS token (15 min)
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpires }
  );

  // step 4: sign long-lived REFRESH token (7 days)
  // uses a DIFFERENT secret so compromising one doesn't break the other
  const refreshToken = jwt.sign(
    { userId: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpires }
  );

  // step 5: store refresh token in DB so we can revoke it on logout
  // 7 days in milliseconds = 7 * 24 * 60 * 60 * 1000
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db('refresh_tokens').insert({
    token:      refreshToken,
    user_id:    user.id,
    expires_at: expiresAt,
  });

  return { accessToken, refreshToken };
}


// ── REFRESH ───────────────────────────────────────────────────
async function refresh(refreshToken) {
  if (!refreshToken) throw new AppError('Refresh token required', 401);

  // step 1: verify the refresh token signature + expiry
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // step 2: check it still exists in DB
  // if logout deleted it, findOne returns undefined — reject
  const stored = await db('refresh_tokens')
    .where({ token: refreshToken })
    .first();

  if (!stored) throw new AppError('Refresh token revoked', 401);

  // step 3: issue brand new access token
  const accessToken = jwt.sign(
    { userId: decoded.userId },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpires }
  );

  return { accessToken };
}


// ── LOGOUT ────────────────────────────────────────────────────
async function logout(refreshToken) {
  // delete from DB — token can never be used again
  // SQL: DELETE FROM refresh_tokens WHERE token = ?
  await db('refresh_tokens')
    .where({ token: refreshToken })
    .delete();
}


module.exports = { register, login, refresh, logout };