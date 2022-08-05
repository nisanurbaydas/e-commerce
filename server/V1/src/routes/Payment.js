const express = require('express')
const router = express.Router();

const {
    processPayment,
    sendStripeApi
} = require('../controllers/Payment')

const { authenticate } = require('../middlewares/authenticate')

router.route('/payment/process').post(authenticate, processPayment);
router.route('/stripeapi').get(authenticate, sendStripeApi);

module.exports = router;