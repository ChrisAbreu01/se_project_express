const clothingItem = require("../models/clothingItems");
const { INVALID_DATA, NOTFOUND, DEFAULT, FORBIDDEN } = require("../utils/errors");

const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;

    clothingItem
        .create({ name, weather, imageUrl, owner: req.user._id})
        .then((item) => {
            res.status(201).send(item);
        })
        .catch((error) => {
            if (error.name === "ValidationError") {
                res.status(INVALID_DATA.error).send({ message: "Invalid data" });
            } else {
                res
                    .status(DEFAULT.error)
                    .send({ message: "error occured on the server" });
            }
        });
};

const getItems = (req, res) => {
    clothingItem
        .find({})
        .then((items) => {
            res.send(items);
        })
        .catch(() => {
            res
                .status(DEFAULT.error)
                .send({ message: "An error has occured on the server" });
        });
};
const updateItem = (req, res) => {
    const { itemId } = req.params;
    const { imageUrl } = req.body;

    clothingItem
        .findByIdAndUpdate(itemId, { $set: { imageUrl } })
        .orFail()
        .then((item) => res.status(200).send({ data: item }))
        .catch((error) => {
            if (error.name === "ValidationError" || error.name === "CastError") {
                res
                    .status(INVALID_DATA.error)
                    .send({ message: "Invalid data provided" });
            } else if (error.name === "DocumentNotFoundError") {
                res.status(NOTFOUND.error).send({ message: "Item not found" });
            } else {
                res
                    .status(DEFAULT.error)
                    .send({ message: "An error has occured on the server" });
            }
        });
};
const deleteItem = (req, res) => {
    const { itemId } = req.params;
    clothingItem
        .findOne({ _id: itemId })
        // eslint-disable-next-line consistent-return
        .then((item) => {
            if (!item) {
                res.status(NOTFOUND.error).send({ message: "Item not found" });
            } else if (String(item.owner) !== req.user._id) {
                return res
                    .status(FORBIDDEN.error)
                    .send({ message: "You are not authorized" });
            } else {
               clothingItem
                    .deleteOne({ _id: itemId })
                    .then(() => {
                        res.status(200).send({ data: item });
                    })
                    .catch(() => {
                        res
                            .status(DEFAULT.error)
                            .send({ message: "An error has occurred on the server " });
                    });
            }
        })
        .catch((error) => {
            if (error.name === "CastError") {
                res.status(INVALID_DATA.error).send({ message: "Invalid item ID" });
            } else {
                res
                    .status(DEFAULT)
                    .send({ message: "An error has occurred on the server" });
            }
        });
};

const likeItem = (req, res) => {
    const { itemId } = req.params;
    const { _id: userId } = req.user;

    clothingItem
        .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
        .then((item) => {
            if (!item) {
                res.status(NOTFOUND.error).send({ message: "Item not found" });
            } else {
                res.status(200).send({ data: item });
            }
        })
        .catch((error) => {
            if (error.name === "CastError") {
                res.status(INVALID_DATA.error).send({ message: "Invalid item ID" });
            } else {
                res
                    .status(DEFAULT.error)
                    .send({ message: "An error has occured on the server" });
            }
        });
};
const disLikeItem = (req, res) => {
    const { itemId } = req.params;
    const { _id: userId } = req.user;

    clothingItem
        .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
        .then((item) => {
            if (!item) {
                res.status(NOTFOUND.error).send({ message: "Item not found" });
            } else {
                res.status(200).send({ data: item });
            }
        })
        .catch((error) => {
            if (error.name === "CastError") {
                res.status(INVALID_DATA.error).send({ message: "Invalid item ID" });
            } else {
                res
                    .status(DEFAULT.error)
                    .send({ message: "An error has occured on the server" });
            }
        });
};
module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem,
    likeItem,
    disLikeItem,
};