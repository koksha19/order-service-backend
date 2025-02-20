const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
  customer: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Admin: Number,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        delivery: {
          type: Object,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

customerSchema.methods.addToCart = function (
  product,
  delivery,
  quantity,
  price
) {
  const id = product._id;
  const productIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === id.toString()
  );

  if (productIndex >= 0) {
    this.cart.items[productIndex].quantity += quantity;
  } else {
    this.cart.items.push({
      productId: id,
      delivery: delivery,
      quantity: quantity,
      price: price,
    });
  }

  return this.save();
};

customerSchema.methods.removeFromCart = function (product) {
  const id = product._id;

  const productIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === id.toString()
  );

  if (productIndex >= -1) this.cart.items.splice(productIndex, 1);
  return this.save();
};

customerSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);
