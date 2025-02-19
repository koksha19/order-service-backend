const Product = require('../models/Product');
const Customer = require('../models/Customer');
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
      const error = new Error('Failed to find product with id ' + product);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      message: 'Fetched product successfully',
      product: product,
    });
  } catch (error) {
    handleError(error, next);
  }
};

const addToCart = async (req, res, next) => {
  const { product, quantity, delivery, price } = req.body;
  const productId = product._id;
  const customerId = req.customerId;

  try {
    const product = await Product.findById(productId);
    const customer = await Customer.findById(customerId);

    if (!product) {
      const error = new Error('Failed to find product with id ' + productId);
      error.statusCode = 404;
      return next(error);
    }

    if (!customer) {
      const error = new Error('Failed to find customer with id ' + customerId);
      error.statusCode = 404;
      return next(error);
    }
    customer.addToCart(product, delivery, quantity, price);
    res.status(200).json({
      message: 'Added product to cart',
      info: {
        product: product,
        delivery: delivery,
        quantity: quantity,
        price: price,
      },
    });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { getProducts, getProduct, addToCart };
