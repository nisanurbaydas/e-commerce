const stripe = require('stripe');

// Process stripe payments   =>   /api/v1/payment/process
const processPayment = async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',

    metadata: { integration_check: 'accept_a_payment' },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
};

// Send stripe API Key   =>   /api/v1/stripeapi
const sendStripeApi = async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
};

module.exports = {
  processPayment,
  sendStripeApi,
};
