const httpStatus = require('http-status');

const OrderService = require('../services/OrderService');
const ApiError = require('../errors/ApiError');

// create new order
const create = (req, res, next) => {
  const newOrder = {
    ...req.body,
    paidAt: Date.now(),
    user: req.user,
  };
  OrderService.create(newOrder)
    .then((response) => {
      res.status(httpStatus.CREATED).json({
        success: true,
        message: 'Your order created has been successfully!',
        response,
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

module.exports = {
  create,
};
