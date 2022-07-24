const express = require('express');

const { index, create, login, update, resetPassword } = require('../controllers/User');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const { createUser, userLogin, updateUser, resetPasswordValidation } = require('../validations/User');

const router = express.Router();

router.get('/', index);

router.route('/').post(validate(createUser), create);
router.route('/').patch(authenticate, validate(updateUser), update);
router.route('/login').post(validate(userLogin), login);
router.route('/reset-password').post(validate(resetPasswordValidation), resetPassword);

module.exports = router;
