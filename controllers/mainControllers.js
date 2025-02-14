const Product = require('../models/Product');
const handleError = require('../util/handleError');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ message: 'Fetched products successfully', products: products });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { getProducts };
