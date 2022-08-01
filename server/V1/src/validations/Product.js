const Joi = require('joi');

const createProduct = Joi.object({
  name: Joi.string().required().min(4).max(100),
  description: Joi.string().required().min(7),
  price: Joi.number().positive().required().max(5),
  stock: Joi.number().positive().required().max(5),
  seller: Joi.string().required()
});

const updateProduct = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().min(2),
  stock: Joi.number(),
  price: Joi.number().positive(),
});

module.exports = {
  createProduct,
  updateProduct,
};