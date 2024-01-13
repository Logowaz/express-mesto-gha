/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

const { notFoundError, validationError, defaultError } = require('../errors/errors');

const statusOK = 201;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res.status(defaultError).send({ message: 'Ошибка по умолчанию', err: err.message });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(validationError).send({ message: 'Переданы некорректные данные при запросе пользователя', err: err.message });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: ' Пользователь по указанному id не найден', err: err.message });
      }
      return res.status(defaultError).send({ message: 'Ошибка по умолчанию', err: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(statusOK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(defaultError).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  console.log(req.user._id);
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new Error('Not found'); })
    .then((user) => {
      if (!user) {
        console.log(req.user._id);
        return res.status(notFoundError).json({ message: 'Пользователь с указанным id не найден' });
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(validationError).json({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(defaultError).json({ message: 'Ошибка по умолчанию' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(defaultError).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
