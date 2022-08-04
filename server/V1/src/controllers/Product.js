const path = require('path');
const httpStatus = require('http-status');
const Product = require('../model/Product');

const ProductService = require('../services/ProductService');
const ApiError = require('../errors/ApiError');
const { checkSecureFile } = require('../scripts/utils/helper');
const APIFeatures = require('../scripts/utils/apiFeatures');

const index = async (req, res, next) => {
  // await ProductService.list()
  //   .then((itemList) => {
  //     if (!itemList) return next(new ApiError('No record', httpStatus.NOT_FOUND));

  //     const apiFeatures = new APIFeatures(itemList, req.query).search();
  //     const items = apiFeatures.query;

  //     res.status(httpStatus.OK).json({
  //       success: true,
  //       count: items.length,
  //       items,
  //     });
  //   })
  //   .catch((e) => next(new ApiError(e?.message)));

  const resPerPage = 4;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(ProductService.list(), req.query).search().filter().pagination(resPerPage);
  const items = await apiFeatures.query;

  res.status(httpStatus.OK).json({
    success: true,
    count: items.length,
    items,
    totalProductsCount: productsCount,
  });
};

const getOne = (req, res, next) => {
  ProductService.findOne({ _id: req.params.id })
    .then((item) => {
      if (!item) return next(new ApiError('No record', httpStatus.NOT_FOUND));
      res.status(httpStatus.OK).send(item);
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
  ProductService.findOne({ _id: req.params.id })
  .then((mainProduct) => {
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
  getOne,
  create,
  update,
  addComment,
  addMedia,
  deleteProduct,
};
