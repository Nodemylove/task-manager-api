const { z } = require('zod');
const AppError = require('../utils/AppError');

// validate is a factory — it takes a Zod schema and returns middleware
// usage: router.post('/', validate(createLogSchema), controller)
function validate(schema) {

  // this is the actual middleware Express will call
  return (req, res, next) => {
    try {
      // schema.parse() validates req.body against the schema
      // if valid: returns the parsed + transformed data
      // if invalid: throws a ZodError with all issues listed
      const parsed = schema.parse(req.body);

      // replace req.body with the parsed version
      // this applies defaults (e.g. level defaults to 'info')
      req.body = parsed;

      // validation passed — move to the next middleware/controller
      next();

    } catch (err) {
      // ZodError has an 'issues' array with all validation failures
      if (err instanceof z.ZodError) {
        // map each issue to a readable message
        const messages = err.issues.map(i => `${i.path.join('.')}: ${i.message}`);

        // 422 Unprocessable Entity = data received but validation failed
        return next(new AppError(messages.join(', '), 422));
      }
      next(err); // unexpected error — pass to global handler
    }
  };
}

module.exports = validate;