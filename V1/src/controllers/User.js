const httpStatus = require('http-status');
const uuid = require('uuid');

const { passwordToHash, generateJWTAccessToken, generateJWTRefreshToken } = require('../scripts/utils/helper');
const eventEmitter = require('../scripts/events/eventEmitter');

const ProductService = require('../services/ProductService');
const UserService = require('../services/UserService');
//const { list, insert, findOne, modify } = require('../services/User');

const index = (req, res) => {
  UserService.list()
    .then((response) => {
      if (!response) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' });
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = async (req, res) => {
  const checkEmail = await UserService.findOne({ email: req.body.email });
  if (checkEmail) return res.status(httpStatus.CONFLICT).send({ message: 'Email is already taken' });
  req.body.password = passwordToHash(req.body.password);
  UserService.create(req.body)
    .then((response) => {
      if (!response) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' });
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  UserService.findOne(req.body)
    .then((user) => {
      if (!user) return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
      user = {
        ...user.toObject(),
        tokens: {
          access_token: generateJWTAccessToken(user),
          refresh_token: generateJWTRefreshToken(user),
        },
      };
      delete user.password;
      res.status(httpStatus.OK).send(user);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const update = (req, res) => {
  UserService.update({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const resetPassword = (req, res) => {
  const new_password = uuid.v4()?.split('-')[0] || `usr-${new Date().getTime()}`;
  UserService.update({ email: req.body.email }, { password: passwordToHash(new_password) })
    .then((updatedUser) => {
      if (!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
      eventEmitter.emit('send_email', {
        //info - send mail with defined transport object
        to: updatedUser.email,
        subject: 'Reset Password',
        html: `User password has been changed. <br /> Your new pasword -> ${new_password}`,
      });
      res.status(httpStatus.OK).send({ message: 'Required information is sent your e-mail' });
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const productList = (req, res) => {
  ProductService
    .list({ user_id: req.user?._id })
    .then((products) => {
      if (!products) res.status(httpStatus.NOT_FOUND).send({ message: 'No record' });
      res.status(httpStatus.OK).send(products);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message));
};

module.exports = {
  index,
  create,
  login,
  update,
  resetPassword,
  productList,
};
