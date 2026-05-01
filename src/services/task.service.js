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
async function createTask(userId, body) {
  // spread the validated body, then add user_id
  // body comes from req.body (already validated by Zod)
  // user_id comes from req.user.userId (set by protect.js)
  const data = {
    ...body,       // title, description, status, priority, category_id
    user_id: userId, // ownership — which user created this task
  };

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