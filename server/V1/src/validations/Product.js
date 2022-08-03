const Joi = require('joi');

const createProduct = Joi.object({
  name: Joi.string().required().min(4).max(100),
  description: Joi.string().required().min(7),
  price: Joi.number().positive().required(),
  stock: Joi.number().positive().required(),
  seller: Joi.string().required(),
  ratings: Joi.number().min(1).max(5),
  images: Joi.array(),
  category: Joi.string(),
  numOfReviews: Joi.number(),
  reviews: Joi.array(),
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
