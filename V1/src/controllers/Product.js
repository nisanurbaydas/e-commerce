const path = require('path');
const httpStatus = require('http-status');

const ProductService = require('../services/ProductService');
const { checkSecureFile } = require('../scripts/utils/helper');

const index = (req, res) => {
  ProductService.list()
    .then((itemList) => {
      if (!itemList) res.status(httpStatus.INTERNAL_SERVER_ERROR).send('No such record');
      res.status(httpStatus.OK).send(itemList);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message);
    });
};

const create = (req, res) => {
  req.body.user_id = req.user;
  ProductService.create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  ProductService.update(req.params.id, req.body)
    .then((updatedItem) => {
      if (!updatedItem) return res.status(httpStatus.NOT_FOUND).send({ message: 'No such a record' });
      res.status(httpStatus.OK).send(updatedItem);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const addComment = (req, res) => {
  ProductService.findOne({ _id: req.params.id }).then((mainProduct) => {
    if (!mainProduct) res.status(httpStatus.NOT_FOUND).send({ message: 'No such record' });
    const comment = {
      ...req.body,
      created_at: new Date(),
      user_id: req.user,
    };
    mainProduct.comments.push(comment);
    ProductService.update(req.params.id, mainProduct)
      .then((updatedItem) => {
        if (!updatedItem) return res.status(httpStatus.NOT_FOUND).send({ message: 'No such a record' });
        res.status(httpStatus.OK).send(updatedItem);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  });
};

const addMedia = (req, res) => {
  if (!req.params.id || !req.files?.file || !checkSecureFile(req?.files?.file?.mimetype)) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing information' });
  ProductService.findOne({ _id: req.params.id }).then((mainProduct) => {
    if (!mainProduct) return res.status(httpStatus.NOT_FOUND).send({ message: 'Product not found' });

    const extension = path.extname(req.files.file.name);
    const fileName = `${mainProduct._id?.toString()}${extension}`;
    const folderPath = path.join(__dirname, '../', 'uploads/products', fileName);

    req.files.file.mv(folderPath, function (err) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      mainProduct.media = fileName;
      ProductService.update(req.params.id, mainProduct)
        .then((updatedItem) => {
          if (!updatedItem) return res.status(httpStatus.NOT_FOUND).send({ message: 'Product not found' });
          res.status(httpStatus.OK).send(updatedItem);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    });
  });
};

const deleteProduct = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing information' });
  }
  ProductService.delete(req.params?.id)
    .then((deletedItem) => {
      if (!deletedItem) if (!response) return res.status(httpStatus.NOT_FOUND).send({ message: 'Product not found' });
      res.status(httpStatus.OK).send(deletedItem);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

module.exports = {
  index,
  create,
  update,
  addComment,
  addMedia,
  deleteProduct,
};
