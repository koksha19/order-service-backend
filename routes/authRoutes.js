const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authControllers');

router.post('/signup', authControllers.signUp);

module.exports = router;
