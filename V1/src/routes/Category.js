const express = require('express');

const { index, create, update, deleteCategory } = require('../controllers/Category');
const idChecker = require('../middlewares/idChecker');

const router = express.Router();

router.route('/').get(index);
router.route('/').post(create);
router.route('/:id').patch(idChecker(), update);
router.route('/:id').delete(idChecker(), deleteCategory);

module.exports = router;
