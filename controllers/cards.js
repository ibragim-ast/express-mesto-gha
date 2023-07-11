const Card = require('../models/card');

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Некорректный формат id карточки.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
