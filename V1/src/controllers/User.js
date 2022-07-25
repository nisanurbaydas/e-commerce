const httpStatus = require('http-status');
const uuid = require('uuid');

const { passwordToHash, generateJWTAccessToken, generateJWTRefreshToken } = require('../scripts/utils/helper');
const eventEmitter = require('../scripts/events/eventEmitter');

const ProductService = require('../services/ProductService');
const UserService = require('../services/UserService');
const ApiError = require('../errors/ApiError');

const index = (req, res, next) => {
  UserService.list()
    .then((response) => {
      if (!response) return next(new ApiError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR));
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const create = async (req, res, next) => {
  const checkEmail = await UserService.findOne({ email: req.body.email });
  if (checkEmail) return next(new ApiError('Email is already taken', httpStatus.CONFLICT));

  req.body.password = passwordToHash(req.body.password);
  UserService.create(req.body)
    .then((response) => {
      if (!response) return next(new ApiError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR));
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const login = (req, res, next) => {
  req.body.password = passwordToHash(req.body.password);
  UserService.findOne(req.body)
    .then((user) => {
      if (!user) return next(new ApiError('No record', httpStatus.NOT_FOUND));
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
    .catch((e) => next(new ApiError(e?.message)));
};

const update = (req, res, next) => {
  UserService.update({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const resetPassword = (req, res, next) => {
  const new_password = uuid.v4()?.split('-')[0] || `usr-${new Date().getTime()}`;
  UserService.update({ email: req.body.email }, { password: passwordToHash(new_password) })
    .then((updatedUser) => {
      if (!updatedUser) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      eventEmitter.emit('send_email', {
        //info - send mail with defined transport object
        to: updatedUser.email,
        subject: 'Reset Password',
        html: `User password has been changed. <br /> Your new pasword -> ${new_password}`,
      });
      res.status(httpStatus.OK).send({ message: 'Required information is sent your e-mail' });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const productList = (req, res, next) => {
  ProductService.list({ user_id: req.user?._id })
    .then((products) => {
      if (!products) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(products);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

module.exports = {
  index,
  create,
  login,
  update,
  resetPassword,
  productList,
};
