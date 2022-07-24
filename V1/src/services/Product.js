const Product = require('../model/Product');

const list = (where) => {
  return Product.find(where || {});
};

const insert = (data) => {
  return new Product(data).save();
};

module.exports = {
  list,
  insert,
};
