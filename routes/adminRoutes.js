const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const isAuthenticated = require('../middleware/isAuth');

router.post('/products', isAuthenticated, adminControllers.createProduct);
router.put('/products/:id', isAuthenticated, adminControllers.updateProduct);
router.delete('/products/:id', isAuthenticated, adminControllers.deleteProduct);
router.get('/orders', isAuthenticated, adminControllers.getOrders);

module.exports = router;
