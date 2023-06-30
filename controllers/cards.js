const Card = require('../models/card');

const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.carsId)
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({
          message: 'Некорректный формат id карточки.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};
