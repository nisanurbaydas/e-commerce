const BaseService = require('./BaseService');
const BaseModel = require('../model/Order');

class OrderService extends BaseService{
  constructor() {
    super(BaseModel);
  }
}

module.exports = new OrderService();
