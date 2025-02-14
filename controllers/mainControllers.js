const handleError = require('../util/handleError');

const getProducts = async (req, res) => {
  try {
    const products = [
      {
        _id: 'lsdjslkfjas',
        title: 'Guitar 1',
        price: 2000,
        delivery: ['Standard', 'Express'],
        description: 'A great guitar',
      },
      {
        _id: 'lsdjslkfjas',
        title: 'Guitar 1',
        price: 2000,
        delivery: ['Standard', 'Express'],
        description: 'A great guitar',
      },
    ];
    res
      .status(200)
      .json({ message: 'Fetched products successfully', products: products });
  } catch (error) {
    handleError(error);
  }
};

module.exports = { getProducts };
