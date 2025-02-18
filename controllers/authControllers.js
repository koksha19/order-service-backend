const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email: email }).exec();
    if (!customer) {
      const error = new Error('No user with such email found');
      error.statusCode = 401;
      return next(error);
    }
    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
      const error = new Error('Password is incorrect');
      error.statusCode = 401;
      return next(error);
    }
    const token = jwt.sign(
      {
        customerId: customer._id.toString(),
        email: customer.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Logged in successfully',
      token: token,
      expiresIn: 3600,
      customerId: customer._id.toString(),
    });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { signUp, logIn };
