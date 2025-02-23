const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const adminControllers = require('../controllers/adminControllers');
const isAuthenticated = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

const validation = [
  check('title', 'Title has to be a string of at least 3 characters')
    .isString()
    .isLength({ min: 3, max: 50 })
    .trim(),
  check('price', 'Price has to be a number and at least 1').isNumeric(),
  check(
    'description',
    'Description has to contain at least 50 characters'
  ).isLength({ min: 30 }),
  check('stock', 'Stock has to be a number and at least 1').isNumeric(),
];

router.post(
  '/products',
  isAuthenticated,
  isAdmin,
  validation,
  adminControllers.createProduct
);
router.put(
  '/products/:productId',
  isAuthenticated,
  isAdmin,
  validation,
  adminControllers.updateProduct
);
router.delete(
  '/products/:id',
  isAuthenticated,
  isAdmin,
  adminControllers.deleteProduct
);
router.get('/orders', isAuthenticated, isAdmin, adminControllers.getOrders);

module.exports = router;
