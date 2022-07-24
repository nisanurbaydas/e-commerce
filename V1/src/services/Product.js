const Product = require('../model/Product');

const list = (where) => {
  return Product.find(where || {}).populate([
    {
      path: 'user_id',
      select: 'first_name email',
    },
    {
      path: 'comments',
      populate: {
        path: 'user_id',
        select: 'first_name',
      },
    },
  ]);
};

const insert = (data) => {
  return new Product(data).save();
};

const findOne = (where) => {
  return Product.findOne(where);
};

const modify = (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  list,
  insert,
  findOne,
  modify,
};
