const Joi = require('joi');

const createOrder = Joi.object({
  shippingInfo: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    phoneNo: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  orderItems: Joi.array().required(),
  paymentInfo: Joi.object().required(),
  itemsPrice: Joi.number().required(),
  taxPrice: Joi.number().required(),
  shippingPrice: Joi.number().required(),
  totalPrice: Joi.number().required(),
});

module.exports = {
  createOrder,
};
