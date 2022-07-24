const User = require('../model/User');

const list = () => {
  return User.find({});
};

const insert = (data) => {
  return new User(data).save();
};

const findOne = (where) => {
  return User.findOne(where);
};

module.exports = {
  list,
  insert,
  findOne,
};
