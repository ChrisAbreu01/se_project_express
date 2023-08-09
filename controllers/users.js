const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const { ALREADYEXISTSERROR, OK } = require("../utils/errors");
const BadRequestError = require("../errorConstructors/BadRequestError");
const ConflictError = require("../errorConstructors/conflictError");
const DefaultError = require("../errorConstructors/DefaultError");
const UnauthorizedError = require("../errorConstructors/unauthorizedError");
const NotFoundError = require("../errorConstructors/NotFoundError");

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  users
    .findOne({ email })
    .then((response) => {
      if (response) {
        const error = new Error("User already exist");
        error.statusCode = ALREADYEXISTSERROR.error;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hpassword) =>
      users.create({
        name,
        email,
        password: hpassword,
        avatar,
      })
    )
    .then((user) => {
      if (user) {
        const userObject = user.toObject();
        delete userObject.password;
        res.status(201).send(userObject);
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else if (error.code === 11000) {
        next(new ConflictError("Email already exists in database"));
      } else if (error.statusCode) {
        res.status(error.statusCode).send({ message: error.message });
      } else {
        next(new DefaultError("An error has occurred on the server"));
      }
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return users
    .findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError("You are not authorized"));
      }
      return bcrypt
        .compare(password, user.password)
        .then((passwordMatch) => {
          if (!passwordMatch) {
            next(new UnauthorizedError("You are not authorized"));
          }
          res.send({
            token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
          });
        })
        .catch(() => {
          next(new UnauthorizedError("You are not authorized"));
        });
    });
};

const getCurrentUser = (req, res, next) => {
  users
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("You are not authorized"));
      }
      res.status(OK.code).send({ data: user });
    })
    .catch(() => {
      next(new DefaultError("An error has occurred on the server"));
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  users
    .findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (!user) {
        next(new NotFoundError("You are not authorized"));
      }
      res.status(OK.code).send(user);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      }
      next(new DefaultError("An error has occurred on the server"));
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
