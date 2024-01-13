/* eslint-disable no-underscore-dangle */
const Card = require('../models/card').default;

const { notFoundError, validationError, defaultError } = require('../errors/errors');

// Обработчик получения всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res.status(defaultError).send({ message: 'Ошибка по умолчанию', err: err.message });
    });
};

// Обработчик удаления карточки по идентификатору
const deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => { throw new Error('Not found'); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(validationError).send({ message: 'Некорректный ID' });
      }
      if (err.message === 'Not found') {
        return res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.status(defaultError).send({ message: 'Ошибка по умолчанию' });
    });
};

// Обработчик создания карточки
const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(defaultError).send({ message: 'Ошибка по умолчанию' });
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
        res.status(notFoundError).json({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(200).json(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(validationError).json({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(defaultError).json({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Обработчик удаления лайка с карточки
const dislikeCard = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(notFoundError).json({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(200).json(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(validationError).json({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(defaultError).json({ message: 'Ошибка по умолчанию' });
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
