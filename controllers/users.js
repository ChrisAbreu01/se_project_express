const users = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { DEFAULT, INVALID_DATA, NOTFOUND } = require("../utils/errors");

const createUser = (req, res) => {
    const { name, avatar, email, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        users.create({ name, avatar, email, password: hash })
            .then((user) => {
                const userData = user.toObject();
                delete userData.password;
                return res.status(201).send({ data: userData });
            })
            .catch((error) => {
                console.log(error);
                if (error.name === "ValidationError") {
                    res
                        .status(INVALID_DATA.error)
                        .send({ message: "Invalid data provided" });
                } else if (error.code === 11000) {
                    res.status(409).send({ message: "Email already exists in database" });
                } else {
                    res
                        .status(INVALID_DATA.error)
                        .send({ message: "An error has occurred on the server" });
                }
            });
    })

};
const getUsers = (req, res) => {
    users.find()
        .then((user) => {
            res.status(200);
            res.send(user);
        })
        .catch(() => {
            res
                .status(DEFAULT.error)
                .send({ message: "An error has occured on the server" });
        });
};
const getUser = (req, res) => {
    const { userId } = req.params;

    users.findById(userId).then((item) => {
            if (!item) {
                res.status(NOTFOUND.error).send({ message: "User not found" });
            } else {
                res.status(200).send({ data: item });
            }
        })
        .catch((error) => {
            if (error.name === "CastError") {
                res.status(INVALID_DATA.error).send({ message: "Invalid user ID" });
            } else {
                res
                    .status(DEFAULT.error)
                    .send({ message: "An error has occured on the server" });
            }
        });
};
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(INVALID_DATA.error)
            .send({ message: "You are not authorized" });
    }
    return user.findOne({ email }).select('+password')
        .then((user) => {
            res.send({
                token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
            });
        })
        .catch((err) => {
            console.log(err);
            console.log(err.name);
            res
                .status(INVALID_DATA.error)
                .send({ message: "You are not authorized" });
        });
};
const getCurrentUser = (req, res) => {
    user.findById(req.user._id)
        .orFail(() => {
            res.status(404).send({ message: "An error has occured on the server" });
        })
        .then((user) => res.status(200).send({ data: user }))
        .catch((err) => {
            res
                .status(404)
                .send({ message: "An error has occured on the server" });
        });
};

const updateCurrentUser = (req, res) => {
    const { name, avatar } = req.body;
    user.findByIdAndUpdate(
            req.user._id, { name, avatar }, { new: true, runValidators: true }
        )
        .orFail(() => {
            res
                .status(DEFAULT.error)
                .send({ message: "An error has occured on the server" });
        })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            res
                .status(DEFAULT.error)
                .send({ message: "An error has occured on the server" });
        });
};

module.exports = {
    createUser,
    getUsers,
    getCurrentUser,
    updateCurrentUser,
    getUser,
    login,
};