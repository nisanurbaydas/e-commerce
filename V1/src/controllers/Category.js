const httpStatus = require('http-status');

const CategoryService = require('../services/CategoryService');

const index = (req, res) => {
  CategoryService.list()
    .then((response) => {
      if (!response) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' });
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  CategoryService.create(req.body)
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
  CategoryService.update(req.params?.id, req.body)
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
  CategoryService.delete(req.params?.id)
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
