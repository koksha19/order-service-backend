const bcrypt = require('bcrypt');

const Customer = require('../models/Customer');
const handleError = require('../util/handleError');

const signUp = async (req, res, next) => {
  const {
    customer,
    email,
    contactName,
    address,
    phone,
    password,
    confPassword,
  } = req.body;

  try {
    if (password !== confPassword) {
      const error = new Error('Passwords do not match');
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({
      customer: customer,
      email: email,
      contactName: contactName,
      address: address,
      phone: phone,
      password: hashedPassword,
      roles: {
        User: 2001,
      },
    });
    res.status(201).json({
      message: 'Created new customer successfully',
      customer: newCustomer,
    });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { signUp };
