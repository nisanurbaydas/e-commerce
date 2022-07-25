const express = require('express');

const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const idChecker = require("../middlewares/idChecker");

const { createProduct, updateProduct, createComment } = require('../validationS/Product');
const { index, create, update, addComment, addMedia, deleteProduct } = require('../controllers/Product');

const router = express.Router();

router.get('/', index);

router.route('/').post(authenticate, validate(createProduct, 'body'), create);
router.route('/:id').patch(idChecker(),authenticate, validate(updateProduct, 'body'), update);
router.route('/:id').delete(idChecker(),deleteProduct);

router.route('/:id/add-comment').post(idChecker(),authenticate, validate(createComment, 'body'), addComment);
router.route('/:id/add-media').post(idChecker(),authenticate, addMedia);

module.exports = router;
