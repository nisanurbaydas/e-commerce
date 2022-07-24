const httpStatus = require('http-status');
const { list, insert, modify, remove } = require('../services/Category');

const index = (req, res) => {
  list()
    .then((response) => {
      if (!response) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' });
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  insert(req.body)
    .then((response) => {
      if (!response) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' });
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing information' });
  }
  modify(req.params?.id, req.body)
    .then((response) => {
      if (!response) return res.status(httpStatus.NOT_FOUND).send({ message: 'Category not found' });
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const deleteCategory = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing information' });
  }
  remove(req.params?.id)
    .then((deletedItem) => {
      if (!deletedItem) if (!response) return res.status(httpStatus.NOT_FOUND).send({ message: 'Category not found' });
      res.status(httpStatus.OK).send(deletedItem);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

module.exports = {
  index,
  create,
  update,
  deleteCategory,
};
