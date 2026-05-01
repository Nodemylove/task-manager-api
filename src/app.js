require('dotenv').config();
require('./db/knex');

const express      = require('express');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./swagger/swagger');
const logger       = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes   = require('./routes/auth.routes');
const taskRoutes   = require('./routes/task.routes'); // NEW

const app = express();
app.use(express.json());
app.use(logger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.json({ message: 'task-manager-api running' }));

app.use('/auth',  authRoutes);
app.use('/tasks', taskRoutes); // NEW — all task routes live under /tasks

app.use(errorHandler); // always last

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server on http://localhost:${PORT}`);
  console.log(`📖 Swagger  http://localhost:${PORT}/api-docs`);
});

module.exports = app;