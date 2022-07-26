const path = require('path');
const httpStatus = require('http-status');

const ProductService = require('../services/ProductService');
const ApiError = require('../errors/ApiError');
const { checkSecureFile } = require('../scripts/utils/helper');

const index = (req, res, next) => {
  ProductService.list()
    .then((itemList) => {
      if (!itemList) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(itemList);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const create = (req, res, next) => {
  req.body.user_id = req.user;
  ProductService.create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const update = (req, res, next) => {
  ProductService.update(req.params.id, req.body)
    .then((updatedItem) => {
      if (!updatedItem) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(updatedItem);
    })
    .catch((e) => next(new ApiError(e?.message)));
};

const addComment = (req, res, next) => {
  ProductService.findOne({ _id: req.params.id }).then((mainProduct) => {
    if (!mainProduct) return next(new ApiError('No record', httpStatus.NOT_FOUND));
    const comment = {
      ...req.body,
      created_at: new Date(),
      user_id: req.user,
    };
    mainProduct.comments.push(comment);
    ProductService.update(req.params.id, mainProduct)
      .then((updatedItem) => {
        if (!updatedItem) return next(new ApiError('No record', httpStatus.NOT_FOUND));
        res.status(httpStatus.OK).send(updatedItem);
      })
      .catch((e) => next(new ApiError(e?.message)));
  });
};

const addMedia = (req, res, next) => {
  if (!req.params.id || !req.files?.file || !checkSecureFile(req?.files?.file?.mimetype)) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing information' });
  ProductService.findOne({ _id: req.params.id }).then((mainProduct) => {
    if (!mainProduct) return next(new ApiError('No record', httpStatus.NOT_FOUND));

    const extension = path.extname(req.files.file.name);
    const fileName = `${mainProduct._id?.toString()}${extension}`;
    const folderPath = path.join(__dirname, '../', 'uploads/products', fileName);

    req.files.file.mv(folderPath, function (err) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      mainProduct.media = fileName;
      ProductService.update(req.params.id, mainProduct)
        .then((updatedItem) => {
          if (!updatedItem) return next(new ApiError('No record', httpStatus.NOT_FOUND));
          res.status(httpStatus.OK).send(updatedItem);
        })
        .catch((e) => next(new ApiError(e?.message)));
    });
  });
};

const deleteProduct = (req, res, next) => {
  ProductService.delete(req.params?.id)
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
  addComment,
  addMedia,
  deleteProduct,
};
