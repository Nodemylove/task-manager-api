const taskQ=require('../queries/task.queries');
const AppError=require('../utils/AppError');
async function getAllTasks(userId) {
    return  taskQ.findAllByUser(userId);
}// ── GET TASK BY ID ────────────────────────────────────────────
async function getTaskById(id, userId) {
  const task = await taskQ.findByIdAndUser(id, userId);

  // if task not found OR doesn't belong to this user — same 404
  // never tell the client which — security best practice
  if (!task) throw new AppError('Task not found', 404);

  return task;
}
const categoryQ = require('../queries/category.queries'); // add this import

async function createTask(userId, body) {

  // if category_id was provided, verify it actually exists
  if (body.category_id) {
    const category = await categoryQ.findById(body.category_id);
    if (!category) throw new AppError('Category not found', 404);
  }

  const data = { ...body, user_id: userId };
  return taskQ.createTask(data);
}
async function updateTask(id, userId, body) {
  // try to update — returns undefined if id+user_id didn't match
  const task = await taskQ.updateTask(id, userId, body);

  // no rows updated = task not found OR not owned by this user
  if (!task) throw new AppError('Task not found', 404);

  return task;
}
async function deleteTask(id, userId) {
  const deleted = await taskQ.deleteTask(id, userId);

  // deleteTask returns the count of deleted rows
  // 0 = task not found OR not owned by this user
  if (!deleted) throw new AppError('Task not found', 404);

  // no return needed — controller just sends success message
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};