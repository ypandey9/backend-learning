// Global Error Handling Middleware

const errorHandler = (err, req, res, next) => {

  // Log error stack for debugging
  console.error(err.stack);

  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error"
  });

};

module.exports = errorHandler;