const cardsRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  addLikeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCheckCardIdRequest,
} = require('../middlewares/requestValidation');

cardsRouter.post('/', validateCreateCard, createCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', validateCheckCardIdRequest, deleteCard);
cardsRouter.put('/:cardId/likes', validateCheckCardIdRequest, addLikeCard);
cardsRouter.delete('/:cardId/likes', validateCheckCardIdRequest, dislikeCard);

module.exports = cardsRouter;
