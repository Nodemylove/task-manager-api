const { z }    = require('zod');
const AppError = require('../utils/AppError');

// factory: takes a Zod schema, returns Express middleware
// usage: router.post('/', validate(createTaskSchema), controller)
function validate(schema) {

  // this is the actual middleware Express calls
  return (req, res, next) => {
    try {
      // schema.parse() validates AND transforms req.body
      // applies defaults: status → 'pending', priority → 'medium'
      // throws ZodError if any field is invalid
      req.body = schema.parse(req.body);

      next(); // validation passed — move to controller

    } catch (err) {
      if (err instanceof z.ZodError) {
        // map each Zod issue to a readable message
        // e.g. "title: Title is required, status: Invalid enum value"
        const messages = err.issues
          .map(i => `${i.path.join('.')}: ${i.message}`)
          .join(', ');

        // 422 = Unprocessable Entity (understood but validation failed)
        return next(new AppError(messages, 422));
      }

      next(err); // unexpected error — pass to errorHandler
    }
  };
}

module.exports = validate;