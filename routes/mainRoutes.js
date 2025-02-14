const express = require('express');
const router = express.Router();

const mainControllers = require('../controllers/mainControllers');

router.get('/products', mainControllers.getProducts);

module.exports = router;
