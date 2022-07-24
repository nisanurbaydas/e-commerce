const httpStatus = require('http-status');
const { passwordToHash, generateJWTAccessToken, generateJWTRefreshToken } = require('../scripts/utils/helper');
const { list, insert, findOne, modify } = require('../services/User');

const index = (req, res) => {
  list()
    .then((response) => {
      if (!response) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' });
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = async (req, res) => {
  const checkEmail = await findOne({ email: req.body.email });
  if (checkEmail) return res.status(httpStatus.CONFLICT).send({ message: 'Email is already taken' });
  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => {
      if (!response) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' });
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  findOne(req.body)
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
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

module.exports = {
  index,
  create,
  login,
  update,
};
