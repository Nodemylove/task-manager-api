const db=require('../db/knex');
// ── FIND ALL CATEGORIES ───────────────────────────────────────
// returns all categories ordered alphabetically
// used for frontend dropdowns when creating/editing a task
// SQL: SELECT id, name FROM categories ORDER BY name ASC
async function findAll() {
  return db('categories')
    .select('id', 'name')        // only id and name needed
    .orderBy('name', 'asc');     // alphabetical order
}
// ── FIND ONE BY ID ────────────────────────────────────────────
// used to validate category_id exists before assigning to a task
// SQL: SELECT id, name FROM categories WHERE id = ? LIMIT 1
async function findById(id) {
  return db('categories')
    .where({ id })
    .select('id', 'name')
    .first();
}

module.exports = { findAll, findById };