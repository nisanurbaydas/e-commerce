const express = require('express');

const authenticate = require('../middlewares/authenticate');
const authorizationCheck = require('../middlewares/authorizationCheck');
const idChecker = require('../middlewares/idChecker');
const validate = require('../middlewares/validate');

const { createOrder } = require('../validationS/Order');
const { create, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/Order');

const router = express.Router();

router.route('/order/new').post(authenticate, validate(createOrder, 'body'), create);

router.route('/order/:id').get(idChecker(), authenticate, getSingleOrder);
router.route('/orders/me').get(authenticate, myOrders);

// admin
router.route('/admin/orders').get(authorizationCheck, getAllOrders);
router.route('/admin/order/:id').patch(authorizationCheck, idChecker(), updateOrder).delete(authorizationCheck, idChecker(), deleteOrder);

module.exports = router;
