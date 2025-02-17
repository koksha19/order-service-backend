const jwt = require('jsonwebtoken');
const handleError = require('../util/handleError');

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      next(error);
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = isAuth;
