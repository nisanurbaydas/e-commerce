const express = require('express');
const { index, create, login } = require('../controllers/User');

const router = express.Router();

router.get('/', index);
router.post('/', create);
router.post('/login', login);

module.exports = router;
