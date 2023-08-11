const clothingItem = require("../models/clothingItems");
const BadRequestError = require("../errorConstructors/BadRequestError");
const ForbiddenError = require("../errorConstructors/ForbiddenError");
const NotFoundError = require("../errorConstructors/NotFoundError");
const { OK } = require("../utils/errors");
const DefaultError = require("../errorConstructors/DefaultError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(error);
      }
    });
};

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      res.send(items);
    })
    .catch((error) => {
      next(error);
    });
};
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Clothing item cannot be found with this ID"));
        return null;
      }
      if (String(item.owner) !== req.user._id) {
        return next(
          new ForbiddenError("You do not have permission to delete this item.")
        );
      }
      return clothingItem
        .deleteOne({ _id: itemId })
        .then(() => {
          res.status(OK.code).send({ data: item });
        })
        .catch(() => {
          next(new DefaultError("An error has occurred on the server"));
        });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(new DefaultError("An error has occurred on the server"));
      }
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Clothing item cannot be found with this ID"));
      } else {
        res.status(200).send({ data: item });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(new DefaultError("An error has occurred on the server"));
      }
    });
};
const disLikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Clothing item cannot be found with this ID"));
      } else {
        res.status(200).send({ data: item });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(new DefaultError("An error has occurred on the server"));
      }
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
};
