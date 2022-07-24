const express = require('express');
const { index, create, update, deleteCategory } = require('../controllers/Category');

const router = express.Router();

router.route('/').get(index);
router.route('/').post(create);
router.route('/:id').patch(update);
router.route('/:id').delete(deleteCategory);

module.exports = router;
