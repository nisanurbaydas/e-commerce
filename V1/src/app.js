const express = require('express');
const helmet = require('helmet');

const config = require('./config/index');
const loaders = require('./loaders');

const { ProductRoutes, UserRoutes } = require('./routes');

config();
loaders();

const app = express();
app.use(express.json());
app.use(helmet());

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);

  app.use('/products', ProductRoutes);
  app.use('/users', UserRoutes);
});
