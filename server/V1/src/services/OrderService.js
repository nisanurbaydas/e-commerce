const BaseService = require('./BaseService');
const BaseModel = require('../model/Order');

class OrderService {
  constructor() {
    super(BaseModel);
  }
}

module.exports = new OrderService();
