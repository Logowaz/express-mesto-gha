const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ValidationError = require('../errors/validationError');
const DefaultError = require('../errors/defaultError');

const { notFoundError, validationError, defaultError } = require('../errors/errors');

const statusOK = 201;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    // .orFail(() => new NotFoundError('Not Found'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Переданы некорректные данные при запросе пользователя');
      } else {
        next(res.status(200).send(user));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedPassword) => 
      User.create({ ...req.body, password: hashedPassword })
        .then((user) => {
          res.status(statusOK)
            .send({ data: user.toJSON() });
        })
        .catch(next)
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } 
        else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким E-mail уже существует'));} 
        else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => new UnauthorizedError('Пользователь не найден'))
    .then((user) => {
      // console.log(user);
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {

            const jwt = jsonWebToken.sign({ 
              _id: user._id 
            }, 'SECRET');
            res.cookie('jwt', jwt, {
              maxAge: 2629440000,
              httpOnly: true,
              sameSite: true,
            });

            res.send({ data: user });
          } else {
            throw new UnauthorizedError('Некорректный логин или пароль');
          }
        });
    })
    .catch(next);
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  console.log(req.user._id);
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      } else next(new DefaultError('Произошла неизвестная ошибка'));
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      } else next(new DefaultError('Произошла неизвестная ошибка'));
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ползователь с указанным id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo
};
