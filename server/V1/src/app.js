const path = require('path');

const express = require('express');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const config = require('./config/index');
const loaders = require('./loaders');
const events = require('./scripts/events');

const { ProductRoutes, UserRoutes, CategoryRoutes } = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

config();
loaders();
events();

const app = express();

app.use('/product-images', express.static(path.join(__dirname, './', 'uploads/products')));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());
app.use(cookieParser());

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);

  app.use('/api/v1', ProductRoutes);
  app.use('/api/v1', UserRoutes);
  app.use('/categories', CategoryRoutes);

  app.use((req, res, next) => {
    const error = new Error('Page you are looking for does not exist');
    error.status = 404;
    next(error);
  });

  app.use(errorHandler);
});
