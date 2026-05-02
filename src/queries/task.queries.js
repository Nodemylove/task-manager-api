const db=require('../db/knex');
// ── FIND ALL BY USER — with LEFT JOIN ─────────────────────────
async function findAllByUser(userId) {
  return db('tasks')
    .where('tasks.user_id', userId)

    // LEFT JOIN: combine tasks with categories table
    // 'categories.id' = the column to match ON from categories table
    // 'tasks.category_id' = the column to match ON from tasks table
    // SQL: LEFT JOIN categories ON categories.id = tasks.category_id
    .leftJoin('categories', 'categories.id', 'tasks.category_id')

    // select SPECIFIC columns — not .select('*') to avoid column name conflicts
    // 'tasks.id' not just 'id' because categories also has an 'id' — must be explicit
    .select(
      'tasks.id',
      'tasks.title',
      'tasks.description',
      'tasks.status',
      'tasks.priority',
      'tasks.category_id',
      'tasks.user_id',
      'tasks.created_at',
      'tasks.updated_at',
      // AS renames the column in the response
      // if no category: category_name will be null (LEFT JOIN behaviour)
      'categories.name as category_name'
    )
    .orderBy('tasks.created_at', 'desc');
}

// ── FIND ONE BY ID AND USER — with LEFT JOIN ──────────────────
async function findByIdAndUser(id, userId) {
  return db('tasks')
    .where('tasks.id', id)
    .where('tasks.user_id', userId)
    .leftJoin('categories', 'categories.id', 'tasks.category_id')
    .select(
      'tasks.id',
      'tasks.title',
      'tasks.description',
      'tasks.status',
      'tasks.priority',
      'tasks.category_id',
      'tasks.user_id',
      'tasks.created_at',
      'tasks.updated_at',
      'categories.name as category_name'
    )
    .first();
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