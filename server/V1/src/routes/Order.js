const express = require('express');

const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const { createOrder } = require('../validationS/Order');
const { create } = require('../controllers/Order');

const router = express.Router();

router.route('/order/new').post(authenticate, validate(createOrder, 'body'), create);

module.exports = router;
