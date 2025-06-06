const fs = require('fs');

const Product = require('../models/Product');
const handleError = require('../util/handleError');
const checkValidity = require('../util/checkValidity');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

const createProduct = async (req, res, next) => {
  const { title, price, delivery, description, stock } = req.body;
  const errors = validationResult(req);

  const imageUrl = req.protocol + '://' + req.get('host');

  try {
    if (!title || !price || !delivery || !description || !stock) {
      const error = new Error('All fields have to be filled');
      error.statusCode = 400;
      return next(error);
    }

    checkValidity(errors, next);

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

const updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const { title, price, delivery, description, stock } = req.body;
  const errors = validationResult(req);

  try {
    if (!title || !price || !delivery || !description || !stock) {
      const error = new Error('All fields have to be filled');
      error.statusCode = 400;
      return next(error);
    }

    checkValidity(errors, next);

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('No such post');
      error.statusCode = 404;
      return next(error);
    }

    if (req.file) {
      const imagePath = product.image.split('/')[4];
      await fs.unlink(`./public/images/${imagePath}`, (err) => {
        if (err) console.error(err);
        console.log('Deleted image');
      });
    }

    const imageUrl = req.protocol + '://' + req.get('host');

    product.title = title;
    product.price = price;
    product.delivery = JSON.parse(delivery);
    product.description = description;
    product.stock = stock;
    product.image = imageUrl + '/images/' + req.file.filename;
    const updatedProduct = await product.save();

    res.status(200).json({
      message: 'Updated post successfully',
      product: updatedProduct,
    });
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

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    if (!orders) {
      const error = new Error('Failed to fetch orders');
      error.statusCode = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ message: 'Fetched orders successfully', orders: orders });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { createProduct, updateProduct, deleteProduct, getOrders };
