const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');

const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const handleError = require('../util/handleError');

const getProducts = async (req, res, next) => {
  const { pagesize, page } = req.query;
  try {
    let products;
    if (pagesize && page) {
      products = await Product.find()
        .skip((page - 1) * pagesize)
        .limit(pagesize);
    }
    const productCount = await Product.countDocuments();
    res.status(200).json({
      message: 'Fetched products successfully',
      products: products,
      productCount: productCount,
    });
  } catch (error) {
    handleError(error, next);
  }
};

const getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Failed to find product with id ' + productId);
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

const getCart = async (req, res, next) => {
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId).populate(
      'cart.items.productId'
    );

    if (!customer) {
      const error = new Error('No customer found with id:' + customerId);
      error.statusCode = 404;
      return next(error);
    }

    const cartItems = customer.cart.items.map((item) => ({
      product: item.productId,
      delivery: item.delivery,
      quantity: item.quantity,
      price: item.price,
    }));

    res
      .status(200)
      .json({ message: 'Fetched cart successfully', items: cartItems });
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

const removeFromCart = async (req, res, next) => {
  const productId = req.params.productId;
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

    await customer.removeFromCart(product);
    res
      .status(200)
      .json({ message: 'Removed product from cart', productId: productId });
  } catch (error) {
    handleError(error, next);
  }
};

const getOrders = async (req, res, next) => {
  const customerId = req.customerId;

  try {
    const orders = await Order.find({
      'customer._id': new mongoose.Types.ObjectId(customerId),
    });
    res
      .status(200)
      .json({ message: 'Fetched orders successfully', orders: orders });
  } catch (error) {
    handleError(error, next);
  }
};

const createOrder = async (req, res, next) => {
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId)
      .populate('cart.items.productId')
      .exec();

    const products = customer.cart.items.map((product) => {
      return {
        product: { ...product.productId._doc },
        quantity: product.quantity,
        delivery: product.delivery,
      };
    });

    const order = await Order.create({
      customer: customer,
      products: products,
      date: new Date().toISOString().split('T')[0],
    });

    await customer.clearCart();

    res
      .status(201)
      .json({ message: 'Created order successfully', order: order });
  } catch (error) {
    handleError(error, next);
  }
};

const getInvoice = async (req, res, next) => {
  const customerId = req.customerId;
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      const error = new Error('Failed to find order with id ' + orderId);
      error.statusCode = 404;
      return next(error);
    }

    if (
      order.customer._id.toString() === customerId ||
      Object.keys(req.roles).includes('Admin')
    ) {
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      let totalCost = 0;
      pdfDoc.fontSize(27).text(`Order - ${order._id}`, {
        underline: true,
      });
      pdfDoc
        .fontSize(16)
        .text(
          '---------------------------------------------------------------------------------------'
        );
      order.products.forEach((product) => {
        pdfDoc.text(
          '       • ' +
            product.product.title +
            ':                                                           ' +
            product.quantity +
            ' × $' +
            product.product.price +
            ' + $' +
            product.delivery.price
        );
        totalCost +=
          product.product.price * product.quantity + product.delivery.price;
      });
      pdfDoc.text(
        '---------------------------------------------------------------------------------------'
      );
      pdfDoc.fontSize(25).text('Total cost: $' + totalCost);
      pdfDoc.end();
    } else {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = {
  getProducts,
  getProduct,
  getCart,
  addToCart,
  removeFromCart,
  getOrders,
  createOrder,
  getInvoice,
};
