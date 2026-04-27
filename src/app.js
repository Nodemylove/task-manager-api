require('dotenv').config();        // ALWAYS first line
require('./db/knex');              // connect to PostgreSQL on startup

const express      = require('express');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./swagger/swagger');
const logger       = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const app          = express();

// ── middleware ──────────────────────────────
app.use(express.json());           // parse JSON request bodies
app.use(logger);                   // log every request to terminal

// ── swagger docs ─────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── health check ─────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'task-manager-api running', version: '1.0.0' });
});

// ── routes ───────────────────────────────────
// (auth + task routes added from Day 3 onwards)

// ── global error handler (MUST be last) ──────
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server on http://localhost:${PORT}`);
  console.log(`📖 Swagger  http://localhost:${PORT}/api-docs`);
});

module.exports = app;