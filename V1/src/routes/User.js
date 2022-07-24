const express = require('express');

const { index, create, login } = require('../controllers/User');
const validate = require('../middlewares/validate');
const { createUser, userLogin } = require('../validations/User');

const router = express.Router();

router.get('/', index);

router.route('/').post(validate(createUser), create);
router.route('/login').post(validate(userLogin), login);

module.exports = router;
