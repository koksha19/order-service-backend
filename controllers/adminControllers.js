const Product = require('../models/Product');
const handleError = require('../util/handleError');

const createProduct = async (req, res, next) => {
  const { title, price, delivery, description, image } = req.body;

  try {
    const product = await Product.create({
      title: title,
      price: price,
      delivery: delivery,
      description: description,
      image: image,
    });
    return res
      .status(201)
      .json({ message: 'Product created successfully', product: product });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { createProduct };
