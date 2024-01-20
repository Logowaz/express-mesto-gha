const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb');
// mongoose.connect('mongodb://127.0.0.1/mestodb');

app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(errors());

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});
