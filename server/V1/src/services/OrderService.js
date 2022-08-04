const BaseService = require('./BaseService');
const BaseModel = require('../model/Order');

class OrderService extends BaseService {
  constructor() {
    super(BaseModel);
  }
  findOne(where) {
    return BaseModel.findOne(where).populate('user', 'name email');
  }
}

module.exports = new OrderService();
