const knexConfig = require('../../knexfile');
const knex       = require('knex');

// create the connected knex instance
// this is what all services import to run queries
// equivalent of: const mongoose = require('mongoose'); mongoose.connect()
const db = knex(knexConfig.development);

// test connection immediately on import
// db.raw('SELECT 1') = simplest possible SQL query — just checks connection
db.raw('SELECT 1')
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1); // crash on startup — better than mysterious errors later
  });

module.exports = db; // export for use in queries + services