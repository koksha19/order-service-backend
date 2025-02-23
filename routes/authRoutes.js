const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const authControllers = require('../controllers/authControllers');

const validation = [
  check('customer', 'Customer length has to be 30 characters tops').isLength({
    max: 30,
  }),
  check('email', 'Enter a valid email').isEmail(),
  check(
    'password',
    'Password has to be at least 5 characters long and contain letters and numbers'
  )
    .isLength({ min: 5 })
    .isAlphanumeric(),
];

router.post('/signup', validation, authControllers.signUp);
router.post('/login', authControllers.logIn);

module.exports = router;
