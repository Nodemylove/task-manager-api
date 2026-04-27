function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const line = `[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`;
    console.log(line);
  });

  next();
}

module.exports = logger;