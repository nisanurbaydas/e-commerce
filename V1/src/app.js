const path = require('path');

const express = require('express');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');

const config = require('./config/index');
const loaders = require('./loaders');
const events = require('./scripts/events');

const { ProductRoutes, UserRoutes, CategoryRoutes } = require('./routes');

config();
loaders();
events();

const app = express();

app.use("/product-images", express.static(path.join(__dirname, "./", "uploads/products")));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);

  app.use('/products', ProductRoutes);
  app.use('/users', UserRoutes);
  app.use('/categories', CategoryRoutes);
});
