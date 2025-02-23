const express = require('express');
const router = express.Router();

const mainControllers = require('../controllers/mainControllers');
const isAuthenticated = require('../middleware/isAuth');

router.get('/products', mainControllers.getProducts);
router.get('/products/:productId', mainControllers.getProduct);
router.get('/cart', isAuthenticated, mainControllers.getCart);
router.post('/cart', isAuthenticated, mainControllers.addToCart);
router.put('/cart/:productId', isAuthenticated, mainControllers.removeFromCart);
router.get('/orders', isAuthenticated, mainControllers.getOrders);
router.post('/orders', isAuthenticated, mainControllers.createOrder);
router.get('/orders/:orderId', isAuthenticated, mainControllers.getInvoice);

module.exports = router;
