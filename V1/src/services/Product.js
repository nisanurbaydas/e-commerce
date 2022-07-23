const Product = require('../model/Product');

const list = () => {
  return Product.find({});
};

const insert = (data) => {
  return new Product(data).save();
};

module.exports = {
  list,
  insert,
};
