const Category = require('../model/Category');

const insert = (data) => {
  return Category.create(data);
};

const list = (where) => {
  return Category.find(where || {});
};

const modify = (where, data) => {
  return Category.findOneAndUpdate(where, data, { new: true });
};

const remove = (id) => {
  return Category.findByIdAndDelete(id);
};

module.exports = {
  list,
  insert,
  modify,
  remove,
};
