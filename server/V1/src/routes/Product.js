const express = require('express');

const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const authorizationCheck = require('../middlewares/authorizationCheck');
const idChecker = require('../middlewares/idChecker');

const { createProduct, updateProduct, createReviewValidation } = require('../validationS/Product');
const {
  index,
  getOne,
  createReview,
  getAllReviews,
  deleteReview,
  create,
  update,
  deleteProduct,
  getAllProducts,
} = require('../controllers/Product');

const router = express.Router();

router.get('/products', index);
router.route('/product/:id').get(idChecker(), getOne);

router.route('/review').patch(authenticate, validate(createReviewValidation, 'body'), createReview);
router.route('/reviews').get(authenticate, getAllReviews);
router.route('/reviews').delete(authenticate, deleteReview);

// admin
router.route('/admin/product/new').post(authorizationCheck, validate(createProduct, 'body'), create);
router
  .route('/admin/product/:id')
  .patch(idChecker(), authorizationCheck, validate(updateProduct, 'body'), update)
  .delete(idChecker(), authorizationCheck, deleteProduct);
router.route('/admin/products').get(authorizationCheck, getAllProducts);

module.exports = router;
