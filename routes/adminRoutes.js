const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');

router.post('/products', adminControllers.createProduct);
router.put('/products/:id', adminControllers.updateProduct);
router.delete('/products/:id', adminControllers.deleteProduct);

module.exports = router;
