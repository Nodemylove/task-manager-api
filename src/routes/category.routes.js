const express            = require('express');
const router             = express.Router();
const categoryController = require('../controllers/category.controller');

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     description: Public route — no auth required. Use for task category dropdown.
 *     responses:
 *       200:
 *         description: Array of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */

// no protect middleware — categories are public
router.get('/', categoryController.getAll);

module.exports = router;