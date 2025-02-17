const fs = require('fs');

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

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Failed to delete post with id ' + productId);
      error.statusCode = 404;
      return next(error);
    }

    const imagePath = product.image.split('/')[4];

    await fs.unlink(`./public/images/${imagePath}`, (err) => {
      if (err) console.error(err);
      console.log('Deleted image');
    });

    await Product.deleteOne({ _id: productId });
    res.status(200).json({ message: 'Deleted post successfully' });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { createProduct, deleteProduct };
