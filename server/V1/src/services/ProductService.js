const BaseService = require('./BaseService');
const BaseModel = require('../model/Product');

class ProductService extends BaseService {
  constructor() {
    super(BaseModel);
  }
  list(where) {
    return BaseModel.find(where || {}).populate([
      {
        path: 'user_id',
        select: 'first_name email',
      },
      {
        path: 'comments',
        populate: {
          path: 'user_id',
          select: 'first_name',
        },
      },
    ]);
  }
}

module.exports = new ProductService();
