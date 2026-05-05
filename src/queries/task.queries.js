const db = require('../db/knex');

// ── FIND ALL BY USER — with pagination + filter + search ──────
async function findAllByUser(userId, {
  page     = 1,
  limit    = 10,
  status,
  priority,
  category_id,
  search,
  sort     = 'desc'
} = {}) {

  const offset  = (page - 1) * limit;           // key formula — same as file-log-api
  const sortDir = sort === 'asc' ? 'asc' : 'desc';

  // ── BASE QUERY — shared between data + count ─────────────────
  // start with the ownership filter — always required
  let baseQuery = db('tasks').where('tasks.user_id', userId);

  // add optional filters — only if the param was provided
  if (status)      baseQuery = baseQuery.where('tasks.status', status);
  if (priority)    baseQuery = baseQuery.where('tasks.priority', priority);
  if (category_id) baseQuery = baseQuery.where('tasks.category_id', Number(category_id));

  // case-insensitive title search
  // whereILike = PostgreSQL ILIKE — same as $regex with $options:'i'
  // % before and after = contains anywhere in the string
  if (search)      baseQuery = baseQuery.whereILike('tasks.title', `%${search}%`);

  // ── COUNT QUERY — same filters, no JOIN, no pagination ───────
  // clone base query before adding JOIN (avoids duplicate count from JOIN)
  // count only tasks.id — clean and accurate
  const countResult = await baseQuery
    .clone()
    .count('tasks.id as total')
    .first();

  const total = parseInt(countResult.total) || 0;

  // ── DATA QUERY — with JOIN + sort + pagination ───────────────
  const tasks = await baseQuery
    .leftJoin('categories', 'tasks.category_id', 'categories.id')
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
    .orderBy('tasks.created_at', sortDir)
    .limit(limit)
    .offset(offset);               // .offset() not .skip() — Knex syntax

  return {
    tasks,
    meta: {
      total,
      page:  Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit) || 1,
    }
  };
}

// findByIdAndUser, createTask, updateTask, deleteTask — unchanged
async function findByIdAndUser(id, userId) {
  return db('tasks')
    .where('tasks.id', id)
    .where('tasks.user_id', userId)
    .leftJoin('categories', 'tasks.category_id', 'categories.id')
    .select(
      'tasks.id', 'tasks.title', 'tasks.description',
      'tasks.status', 'tasks.priority', 'tasks.category_id',
      'tasks.user_id', 'tasks.created_at', 'tasks.updated_at',
      'categories.name as category_name'
    )
    .first();
}

async function createTask(data) {
  const [task] = await db('tasks').insert(data).returning('*');
  return task;
}

async function updateTask(id, userId, data) {
  const [task] = await db('tasks')
    .where({ id, user_id: userId })
    .update({ ...data, updated_at: new Date() })
    .returning('*');
  return task;
}

async function deleteTask(id, userId) {
  return db('tasks').where({ id, user_id: userId }).delete();
}

module.exports = {
  findAllByUser,
  findByIdAndUser,
  createTask,
  updateTask,
  deleteTask,
};
