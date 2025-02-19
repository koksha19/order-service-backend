const express = require('express');
const router = express.Router();

const mainControllers = require('../controllers/mainControllers');
const isAuthenticated = require('../middleware/isAuth');

router.get('/products', mainControllers.getProducts);
router.get('/products/:id', mainControllers.getProduct);
router.get('/cart', isAuthenticated, mainControllers.getCart);
router.post('/cart', isAuthenticated, mainControllers.addToCart);
router.put('/cart/:productId', isAuthenticated, mainControllers.removeFromCart);
router.post('/orders', isAuthenticated, mainControllers.createOrder);

module.exports = router;
