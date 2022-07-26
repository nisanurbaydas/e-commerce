const Joi = require('joi');

const createUser = Joi.object({
  first_name: Joi.string().required().min(2),
  last_name: Joi.string().required().min(2),
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(8),
});

const updateUser = Joi.object({
  first_name: Joi.string().min(2),
  last_name: Joi.string().min(2),
});

const userLogin = Joi.object({
  email: Joi.string().email().required().min(6),
  password: Joi.string().required().min(8),
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().min(6),
});

module.exports = {
  createUser,
  userLogin,
  updateUser,
  resetPasswordValidation,
};
