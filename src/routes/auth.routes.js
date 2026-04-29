const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/auth.controller');
const validate       = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: shoaib@test.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Email already registered
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: shoaib@test.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Returns accessToken and refreshToken
 *       401:
 *         description: Invalid credentials
 */
router.post('/login',    validate(loginSchema),    authController.login);

// refresh and logout don't need Zod validation — simple body
router.post('/refresh',  authController.refresh);
router.post('/logout',   authController.logout);

module.exports = router;