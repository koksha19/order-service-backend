const bcrypt = require('bcrypt');

const Customer = require('../models/Customer');
const handleError = require('../util/handleError');

const signUp = async (req, res, next) => {
  const { customer, email, contactName, address, phone, password } = req.body;

  try {
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
