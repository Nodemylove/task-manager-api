const taskService = require('../services/task.service');
const AppError    = require('../utils/AppError');

// GET /tasks — with pagination + filter + search
async function getAll(req, res, next) {
  try {
    // read all query params from URL
    // GET /tasks?page=2&limit=5&status=done&search=buy&sort=asc
    const { page, limit, status, priority, category_id, search, sort } = req.query;

    // sanitize page and limit — must be positive integers
    const pageNum  = Math.max(1, Number(page)  || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10)); // cap at 100

    // validate status — only allowed values
    const validStatuses = ['pending', 'in_progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      return next(new AppError('status must be pending, in_progress or done', 400));
    }

    // validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return next(new AppError('priority must be low, medium or high', 400));
    }

    // validate sort direction
    const sortDir = ['asc', 'desc'].includes(sort) ? sort : 'desc';

    // build options object and pass to service
    const options = {
      page:        pageNum,
      limit:       limitNum,
      status:      status      || undefined,
      priority:    priority    || undefined,
      category_id: category_id || undefined,
      search:      search      || undefined,
      sort:        sortDir,
    };

    const result = await taskService.getAllTasks(req.user.userId, options);

    res.status(200).json({
      success: true,
      data:    result.tasks,
      meta:    result.meta,
    });
  } catch (err) { next(err); }
}

// getOne, create, update, remove — unchanged
async function getOne(req, res, next) {
  try {
    const task = await taskService.getTaskById(Number(req.params.id), req.user.userId);
    res.status(200).json({ success: true, data: task });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const task = await taskService.createTask(req.user.userId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.user.userId, req.body);
    res.status(200).json({ success: true, data: task });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await taskService.deleteTask(Number(req.params.id), req.user.userId);
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };