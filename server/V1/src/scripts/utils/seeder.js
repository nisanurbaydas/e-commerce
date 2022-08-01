const Product = require('../../model/Product');
const config = require('../../config/index');
const loaders = require('../../loaders');

const products = require('../../data/products.json');

config();
loaders();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('Products are deleted');

    await Product.insertMany(products);
    console.log('All Products are added.');

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
