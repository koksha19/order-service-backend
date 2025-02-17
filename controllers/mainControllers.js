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

const getProduct = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Failed to find post with id ' + product);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      message: 'Fetched post successfully',
      product: product,
    });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { getProducts, getProduct };
