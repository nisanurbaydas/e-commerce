const Joi = require('joi');

const createProduct = Joi.object({
  name: Joi.string().required().min(7),
  description: Joi.string().required().min(7),
  category_id: Joi.string().required().min(8),
  unit_price: Joi.number().positive().required(),
  quantity: Joi.number().positive(),
});

const updateProduct = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().min(2),
  quantity: Joi.number().positive(),
  unit_price: Joi.number().positive(),
  category: Joi.array(),
  comments: Joi.array(),
  media: Joi.string(),
});

const createComment = Joi.object({
  comment: Joi.string().min(2).default(""),
  rate: Joi.number().required().min(1).max(5),
});

module.exports = {
  createProduct,
  updateProduct,
  createComment,
};