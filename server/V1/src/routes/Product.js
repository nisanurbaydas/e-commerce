const express = require('express');

const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const idChecker = require('../middlewares/idChecker');

const { createProduct, updateProduct } = require('../validationS/Product');
const { index, create, update, addComment, addMedia, deleteProduct, getOne } = require('../controllers/Product');

const router = express.Router();

router.get('/products', index);
router.route('/product/:id').get(idChecker(), getOne);

router.route('/admin/product/new').post(authenticate, validate(createProduct, 'body'), create);
router.route('/admin/product/:id').patch(idChecker(), update).delete(idChecker(), deleteProduct);

module.exports = router;