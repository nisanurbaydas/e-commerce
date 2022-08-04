const express = require('express');

const authenticate = require('../middlewares/authenticate');
const idChecker = require('../middlewares/idChecker');
const validate = require('../middlewares/validate');

const { createOrder } = require('../validationS/Order');
const { create, getSingleOrder, myOrders } = require('../controllers/Order');

const router = express.Router();

router.route('/order/new').post(authenticate, validate(createOrder, 'body'), create);

router.route('/order/:id').get(idChecker(), authenticate, getSingleOrder);
router.route('/orders/me').get(authenticate, myOrders);

module.exports = router;
