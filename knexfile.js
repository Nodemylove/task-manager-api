require('dotenv').config(); // load .env before reading process.env

// Knex CLI reads this file for migrate + seed commands
// it is NOT the connection instance — just the config object
module.exports = {
  development: {
    client: 'pg',                     // use PostgreSQL driver
    connection: {
      host:     process.env.DB_HOST,  // localhost (Docker exposes :5432)
      port:     Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    migrations: {
      directory: './src/db/migrations', // where migration files live
      tableName:  'knex_migrations',    // Knex tracks what ran in this table
    },
    seeds: {
      directory: './src/db/seeds',      // where seed files live
    },
  },
};