const httpStatus = require('http-status');

const CategoryService = require('../services/CategoryService');
const ApiError = require('../errors/ApiError');

const index = (req, res, next) => {
  CategoryService.list()
    .then((response) => {
      if (!response) return next(new ApiError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR));
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const create = (req, res, next) => {
  CategoryService.create(req.body)
    .then((response) => {
      if (!response) return next(new ApiError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR));
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const update = (req, res, next) => {
  CategoryService.update(req.params?.id, req.body)
    .then((response) => {
      if (!response) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const deleteCategory = (req, res, next) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing information' });
  }
  CategoryService.delete(req.params?.id)
    .then((deletedItem) => {
      if (!deletedItem) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(deletedItem);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

module.exports = {
  index,
  create,
  update,
  deleteCategory,
};
