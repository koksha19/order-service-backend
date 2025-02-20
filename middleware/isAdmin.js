const isAdmin = (req, res, next) => {
  if (!req?.roles) return res.sendStatus(403);
  if (Object.keys(req.roles).includes('Admin')) {
    next();
  } else {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    return next(error);
  }
};

module.exports = isAdmin;
