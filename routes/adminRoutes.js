const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const isAuthenticated = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

router.post(
  '/products',
  isAuthenticated,
  isAdmin,
  adminControllers.createProduct
);
router.put(
  '/products/:id',
  isAuthenticated,
  isAdmin,
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
