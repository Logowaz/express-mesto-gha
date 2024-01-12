/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const { notFoundError, validationError, defaultError } = require('../errors/errors');

// Обработчик получения всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).json(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны', err: err.message });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден', err: err.message });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера', err: err.message });
    });
};

// Обработчик создания карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).json(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .json({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// Обработчик удаления карточки по идентификатору
const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).json({ message: 'Карточка не найдена' });
      } else {
        res.status(200).json(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .json({ message: 'Некорректный идентификатор карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// Обработчик постановки лайка карточке
const likeCard = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).json({ message: 'Карточка не найдена' });
      } else {
        res.status(200).json(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .json({ message: 'Некорректный идентификатор карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// Обработчик удаления лайка с карточки
const dislikeCard = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).json({ message: 'Карточка не найдена' });
      } else {
        res.status(200).json(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .json({ message: 'Некорректный идентификатор карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
