const BaseService = require('./BaseService');
const BaseModel = require('../model/Category');

class CategoryService extends BaseService {
  constructor() {
    super(BaseModel);
  }
}

module.exports = new CategoryService();
