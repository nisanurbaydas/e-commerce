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

const getSingleOrder = (req, res, next) => {
  OrderService.findOne({ _id: req.params.id })
    .then((order) => {
      if (!order) return next(new ApiError('No order found with this id', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).json({
        success: true,
        order,
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

//Get logged in user orders
const myOrders = (req, res, next) => {
  OrderService.list({ user: req.user })
    .then((orders) => {
      if (!orders) return next(new ApiError('You do not have any order', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).json({
        success: true,
        orders,
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

module.exports = {
  create,
  getSingleOrder,
  myOrders,
};
