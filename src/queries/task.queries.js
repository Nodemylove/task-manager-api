const db=require('../db/knex');
async function findAllByUser(userId) {
    return db('tasks')
    .where({user_id:userId})
    .orderBy('created_at','desc');
    
}
async function findByIdAndUser(id, userId) {
  return db('tasks')
    .where({ id, user_id: userId })      // must match BOTH conditions
    .first();                            // returns object or undefined
}
// ── CREATE TASK ───────────────────────────────────────────────
// inserts a new task and returns the full created row
// SQL: INSERT INTO tasks (...) VALUES (...) RETURNING *
async function createTask(data) {
  // .returning('*') = return ALL columns of the inserted row
  // without it, Knex only returns the number of rows inserted
  const [task] = await db('tasks')
    .insert(data)
    .returning('*');
  return task;
}
// ── UPDATE TASK ───────────────────────────────────────────────
// updates ONLY if the task belongs to this user
// returns the updated row or undefined if not found
// SQL: UPDATE tasks SET ... WHERE id = ? AND user_id = ? RETURNING *
async function updateTask(id, userId, data) {
  const [task] = await db('tasks')
    .where({ id, user_id: userId })      // ownership check in the query itself
    .update({
      ...data,
      updated_at: new Date(),            // manually update the timestamp
    })
    .returning('*');
  return task;                           // undefined if no row matched
}
// ── DELETE TASK ───────────────────────────────────────────────
// deletes ONLY if the task belongs to this user
// returns number of deleted rows (0 or 1)
// SQL: DELETE FROM tasks WHERE id = ? AND user_id = ?
async function deleteTask(id, userId) {
  return db('tasks')
    .where({ id, user_id: userId })      // ownership check — always both conditions
    .delete();                           // returns count of deleted rows
}
module.exports = {
  findAllByUser,
  findByIdAndUser,
  createTask,
  updateTask,
  deleteTask,
};