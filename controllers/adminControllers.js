const Product = require('../models/Product');
const handleError = require('../util/handleError');

const createProduct = async (req, res, next) => {
  const { title, price, delivery, description, stock } = req.body;

  const imageUrl = req.protocol + '://' + req.get('host');

  try {
    const product = await Product.create({
      title: title,
      price: price,
      delivery: JSON.parse(delivery),
      description: description,
      stock: stock,
      image: imageUrl + '/images/' + req.file.filename,
    });
    return res
      .status(201)
      .json({ message: 'Product created successfully', product: product });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { createProduct };
