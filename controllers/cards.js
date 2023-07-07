const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');

const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/constants');

const createCard = (req, res) => Card.create({
  name: req.body.name,
  link: req.body.link,
  owner: req.user._id,
})
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      return res.status(ERROR_CODE_INVALID_DATA).send({
        message: 'Переданы некорректные данные при создании карточки.',
      });
    }
    return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
  });

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'У вас нет прав на удаление этой карточки' });
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send({ message: 'Карточка успешно удалена' });
        })
        .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Некорректный формат id карточки.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
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

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
