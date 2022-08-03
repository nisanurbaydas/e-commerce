const express = require('express');

const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const authorizationCheck = require('../middlewares/authorizationCheck');
const idChecker = require('../middlewares/idChecker');

const { createUser, userLogin, forgotPasswordValidation, updateProfileValidation, updateUser, updatePasswordValidation, resetPasswordValidation } = require('../validations/User');
const { index, create, login, forgotPassword, resetPassword, logout, getUserProfile, updatePassword, updateProfile, getUserDetails, update, deleteUser } = require('../controllers/User');

const router = express.Router();

router.route('/register').post(validate(createUser, 'body'), create);
router.route('/login').post(validate(userLogin, 'body'), login);
router.get('/logout', logout);

router.route('/password/forgot').post(validate(forgotPasswordValidation, 'body'), forgotPassword);
router.route('/password/reset/:token').patch(validate(resetPasswordValidation, 'body'), resetPassword);

router.route('/me').get(authenticate, getUserProfile);
router.route('/password/update').patch(authenticate, validate(updatePasswordValidation, 'body'), updatePassword);
router.route('/me/update').patch(authenticate, validate(updateProfileValidation, 'body'), updateProfile);

//ADMİN
router.route('/admin/users').get(authorizationCheck, index);
router
  .route('/admin/users/:id')
  .get(authorizationCheck, idChecker(), getUserDetails)
  .patch(authorizationCheck, idChecker(), validate(updateUser, 'body'), update)
  .delete(authorizationCheck, idChecker(), deleteUser);

module.exports = router;
