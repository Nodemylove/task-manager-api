const express   = require('express');
const router    = express.Router();
const protect   = require('../middleware/protect');
const validate  = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');
const c         = require('../controllers/task.controller');

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all my tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of tasks
 *       401:
 *         description: No token
 */
router.get('/', protect, c.getAll);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get one task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task object
 *       404:
 *         description: Task not found
 */
router.get('/:id', protect, c.getOne);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 example: Milk, eggs, bread
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               category_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Task created
 *       422:
 *         description: Validation error
 */
router.post('/', protect, validate(createTaskSchema), c.create);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task (partial)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Updated task
 *       404:
 *         description: Task not found
 */
router.patch('/:id', protect, validate(updateTaskSchema), c.update);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete('/:id', protect, c.remove);

module.exports = router;