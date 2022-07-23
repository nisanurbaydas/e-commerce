const httpStatus = require('http-status');
const { list, insert } = require('../services/Product');

const index = (req, res) => {
  list()
    .then((itemList) => {
      if (!itemList) res.status(httpStatus.INTERNAL_SERVER_ERROR).send('No such record');
      res.status(httpStatus.OK).send(itemList);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

module.exports = {
  index,
  create,
};
