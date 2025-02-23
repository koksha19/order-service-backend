const checkValidity = (errors, next) => {
  if (!errors.isEmpty()) {
    const error = new Error('Failed to create a product due to validation');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
};

module.exports = checkValidity;
