const httpStatus = require('http-status');
const JWT = require('jsonwebtoken');

const { passwordToHash, getResetPasswordToken } = require('../scripts/utils/helper');
const eventEmitter = require('../scripts/events/eventEmitter');

const UserService = require('../services/UserService');
const ApiError = require('../errors/ApiError');
const sendToken = require('../scripts/utils/jwtToken');

//register
const create = (req, res, next) => {
  req.body.password = passwordToHash(req.body.password);
  UserService.create(req.body)
    .then((response) => {
      if (!response) return next(new ApiError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR));
      sendToken(response, httpStatus.OK, res);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const login = (req, res, next) => {
  req.body.password = passwordToHash(req.body.password);
  UserService.findOne(req.body)
    .then((user) => {
      if (!user) return next(new ApiError('Email or password incorrect', httpStatus.NOT_FOUND));
      // user = {
      //   ...user.toObject(),
      //   tokens: {
      //     access_token: generateJWTAccessToken(user),
      //     refresh_token: generateJWTRefreshToken(user),
      //   },
      // };
      // delete user.password;
      // res.status(httpStatus.OK).send(user);
      sendToken(user, httpStatus.OK, res);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const logout = (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Logged out',
  });
};

const forgotPassword = (req, res, next) => {
  UserService.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return next(new ApiError('No record', httpStatus.NOT_FOUND));

      //Get reset token
      const resetToken = getResetPasswordToken(user);

      //Create reset password url
      const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

      eventEmitter.emit('send_email', {
        //info - send mail with defined transport object
        to: user.email,
        subject: 'Blossom Password Recovery',
        html: `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`,
      });

      res.status(httpStatus.OK).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    })
    .catch((e) => {
      return next(new ApiError(e?.message));
    });
};

const resetPassword = (req, res, next) => {
  const token = req.params.token;
  JWT.verify(token, process.env.RESET_PASSWORD_KEY, (err, user) => {
    if (err) return next(new ApiError('Incorrect token or it is expired', httpStatus.BAD_REQUEST));
    req.user = user;
  });

  if (req.body.password !== req.body.confirmPassword) return next(new ApiError('Passwords do not match', httpStatus.BAD_REQUEST));
  req.body.password = passwordToHash(req.body.password);

  UserService.update({ _id: req.user._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).json({
        success: true,
        message: 'Your password changed successfully',
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

// Get currently logged in user details
const getUserProfile = (req, res, next) => {
  UserService.findOne({ _id: req.user })
    .then((user) => {
      if (!user) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).json({
        success: true,
        user,
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

// Update/change password currenttly logged in user
const updatePassword = (req, res, next) => {
  req.body.oldPassword = passwordToHash(req.body.oldPassword);
  UserService.findOne({ password: req.body.oldPassword })
    .then((user) => {
      if (!user) return next(new ApiError('Old password is not correct'));
      req.body.password = passwordToHash(req.body.password);
      UserService.update({ _id: req.user._id }, req.body)
        .then((updatedUser) => {
          if (!updatedUser) return next(new ApiError('No record', httpStatus.NOT_FOUND));
          sendToken(updatedUser, httpStatus.OK, res);
        })
        .catch((e) => next(new ApiError(e?.message)));
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const updateProfile = (req, res, next) => {
  UserService.update({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

/********   ADMIN   ********/

//get all users
const index = (req, res, next) => {
  UserService.list()
    .then((response) => {
      if (!response) return next(new ApiError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR));
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const getUserDetails = (req, res, next) => {
  UserService.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).json({
        success: true,
        user,
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const update = (req, res, next) => {
  UserService.update({ _id: req.params.id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const deleteUser = (req, res, next) => {
  UserService.delete(req.params?.id)
    .then((deletedItem) => {
      if (!deletedItem) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).json({
        success: true,
        message: "You deleted the user succesfully"
      });
    })
    .catch((e) => next(new ApiError(e?.message)));
};

module.exports = {
  index,
  create,
  login,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  update,
  getUserDetails,
  deleteUser,
};
