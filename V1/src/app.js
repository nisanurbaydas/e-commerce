const express = require('express');
const helmet = require('helmet');

const config = require('./config/index');

config();

const app = express();
app.use(express.json());
app.use(helmet());

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
