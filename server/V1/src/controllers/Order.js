const httpStatus = require('http-status');

const OrderService = require('../services/OrderService');
const ApiError = require('../errors/ApiError');
const ProductService = require('../services/ProductService');

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

// ADMIN
const getAllOrders = (req, res, next) => {
  OrderService.list().then((orders) => {
    if (!orders) return next(new ApiError('Currently you do not have any orders you losers', httpStatus.NOT_FOUND));

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    res.status(httpStatus.OK).json({
      success: true,
      totalAmount,
      orders,
    });
  });
};

const updateOrder = async (req, res, next) => {
  await OrderService.findOne({ _id: req.params.id }).then(async (order) => {
    if (order.orderStatus === 'Delivered') return next(new ApiError('You have already delivered this order', httpStatus.BAD_REQUEST));

    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });

    const updatedOrder = {
      ...req.body,
      deliveredAt: Date.now(),
    };

    await OrderService.update(req.params.id, updatedOrder).then((response) => {
      res.status(httpStatus.OK).json({
        success: true,
        message: 'You update the order successfully',
      });
    });
  });
};

async function updateStock(id, quantity) {
  await ProductService.findOne({ _id: id })
  .then(async (product) => {
    product.stock = product.stock - quantity;
    await ProductService.update({ _id: id }, { stock: product.stock });
  });
}

const deleteOrder = (req, res, next) => {
  OrderService.delete(req.params?.id)
    .then((deletedItem) => {
      if (!deletedItem) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).json({
        success: true,
        message: 'Order deleted successfully',
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

module.exports = {
  create,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
