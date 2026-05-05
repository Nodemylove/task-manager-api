const taskQ    = require('../queries/task.queries');
const AppError = require('../utils/AppError');

// ── GET ALL TASKS — accepts options from controller ───────────
// options = { page, limit, status, priority, category_id, search, sort }
// service just passes them through — no business logic needed here
async function getAllTasks(userId, options = {}) {
  return taskQ.findAllByUser(userId, options);
}

// getTaskById, createTask, updateTask, deleteTask — all unchanged
async function getTaskById(id, userId) {
  const task = await taskQ.findByIdAndUser(id, userId);
  if (!task) throw new AppError('Task not found', 404);
  return task;
}

async function createTask(userId, body) {
  return taskQ.createTask({ ...body, user_id: userId });
}

async function updateTask(id, userId, body) {
  const task = await taskQ.updateTask(id, userId, body);
  if (!task) throw new AppError('Task not found', 404);
  return task;
}

async function deleteTask(id, userId) {
  const deleted = await taskQ.deleteTask(id, userId);
  if (!deleted) throw new AppError('Task not found', 404);
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};