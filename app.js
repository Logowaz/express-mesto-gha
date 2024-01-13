const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { notFoundError } = require('./errors/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '65a1c29d2825a56df1858454',
  };
  next();
});
// mongoose.connect('mongodb://127.0.0.1/mestodb');
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(router);
app.use('/*', (req, res) => {
  res.status(notFoundError).send({ message: 'Кажется что-то пошло не так...' });
});

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});
