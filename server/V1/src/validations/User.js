const Joi = require('joi');

const createUser = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(8),
  isAdmin: Joi.boolean(),
});

const userLogin = Joi.object({
  email: Joi.string().email().required().min(6),
  password: Joi.string().required().min(8),
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().min(6),
});

const resetPasswordValidation = Joi.object({
  oldPassword: Joi.string().required().min(8),
  confirmPassword: Joi.string().required().min(8),
});

const updatePasswordValidation = Joi.object({
  oldPassword: Joi.string().required().min(8),
  password: Joi.string().required().min(8),
});

const updateProfileValidation = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email().min(8),
  password: Joi.string().min(8),
});

// Admin validations

const updateUser = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email().min(8),
  isAdmin: Joi.boolean(),
});

module.exports = {
  createUser,
  userLogin,
  forgotPasswordValidation,
  updateProfileValidation,
  updateUser,
  updatePasswordValidation,
  resetPasswordValidation
};
