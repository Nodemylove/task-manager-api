const categoryQ = require('../queries/category.queries');

// GET /categories — returns all categories
// used by frontend for task category dropdown
async function getAll(req, res, next) {
  try {
    const categories = await categoryQ.findAll();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) { next(err); }
}

module.exports = { getAll };