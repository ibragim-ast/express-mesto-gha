const { Error: { ValidationError, CastError } } = require('mongoose');
const Card = require('../models/card');
const {
  CARD_NOT_FOUND_MESSAGE,
  INCORRECT_ADD_CARD_DATA_MESSAGE,
  INCORRECT_LIKE_CARD_DATA_MESSAGE,
  INCORRECT_CARD_DATA_MESSAGE,
  NO_RIGHTS_TO_DELETE_ERROR_MESSAGE,
} = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const checkData = (data) => {
  if (!data) throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
};

const handleLikeError = (next, error) => {
  if (error instanceof CastError) {
    return next(new BadRequestError(INCORRECT_LIKE_CARD_DATA_MESSAGE));
  }
  return next(error);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof ValidationError) {
        return next(new BadRequestError(INCORRECT_ADD_CARD_DATA_MESSAGE));
      }
      return next(error);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => next(error));
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .populate('likes')
    .then((card) => {
      checkData(card);
      return res.send(card.likes);
    })
    .catch((error) => handleLikeError(next, error));
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      checkData(card);
      return res.send(card.likes);
    })
    .catch((error) => handleLikeError(next, error));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      checkData(card);

      const ownerId = card.owner.valueOf();
      const userId = req.user._id;
      if (ownerId !== userId) {
        return next(new ForbiddenError(NO_RIGHTS_TO_DELETE_ERROR_MESSAGE));
      }

      return card.deleteOne();
    })
    .then((deletedCard) => res.send(deletedCard))
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError(INCORRECT_CARD_DATA_MESSAGE));
      } else {
        next(error);
      }
    });
};
