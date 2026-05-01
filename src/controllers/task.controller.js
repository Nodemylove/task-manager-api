
const taskService = require('../services/task.service');

// GET /tasks — all tasks belonging to logged-in user
async function getAll(req, res, next) {
  try {
    const tasks = await taskService.getAllTasks(req.user.userId);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) { next(err); }
}

// GET /tasks/:id — one task (must belong to logged-in user)
async function getOne(req, res, next) {
  try {
    // req.params.id is a string — convert to Number for SQL
    const task = await taskService.getTaskById(Number(req.params.id), req.user.userId);
    res.status(200).json({ success: true, data: task });
  } catch (err) { next(err); }
}

// POST /tasks — create a new task
async function create(req, res, next) {
  try {
    // req.body = validated task data (from Zod)
    // req.user.userId = logged-in user's id (from protect.js)
    const task = await taskService.createTask(req.user.userId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
}

// PATCH /tasks/:id — partial update
async function update(req, res, next) {
  try {
    const task = await taskService.updateTask(
      Number(req.params.id),
      req.user.userId,
      req.body
    );
    res.status(200).json({ success: true, data: task });
  } catch (err) { next(err); }
}

// DELETE /tasks/:id — delete a task
async function remove(req, res, next) {
  try {
    await taskService.deleteTask(Number(req.params.id), req.user.userId);
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };