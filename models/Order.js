const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  customer: {
    type: Object,
    required: true,
  },
  products: [
    {
      type: {
        product: {
          type: Object,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        delivery: {
          type: Object,
          required: true,
        },
      },
      required: true,
    },
  ],
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
