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
          type: Array,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

customerSchema.methods.addToCart = function (product, quantity) {
  const id = product._id;
  const productIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === id.toString()
  );

  this.cart.items[productIndex].quantity += quantity;

  return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);
