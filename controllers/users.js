const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const {
  DEFAULT,
  INVALID_DATA,
  NOTFOUND,
  UNAUTHORIZED,
  ALREADYEXISTSERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, email, password, avatar } = req.body;

  users
    .findOne({ email })
    .then((response) => {
      if (response) {
        // return res
        //   .status(ALREADYEXISTSERROR.error)
        //   .send({ message: "User already exist" });
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
        res
          .status(INVALID_DATA.error)
          .send({ message: "Invalid data provided" });
      } else if (error.code === 11000) {
        res
          .status(ALREADYEXISTSERROR)
          .send({ message: "Email already exists in database" });
      } else if (error.statusCode) {
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res
          .status(DEFAULT.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(UNAUTHORIZED.error)
      .send({ message: "You are not authorized" });
  }
  return users
    .findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        res
          .status(UNAUTHORIZED.error)
          .send({ message: "You are not authorized" });
      }
      return bcrypt
        .compare(password, user.password)
        .then((passwordMatch) => {
          if (!passwordMatch) {
            res
              .status(UNAUTHORIZED.error)
              .send({ message: "You are not authorized" });
          }
          res.send({
            token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
          });
        })
        .catch(() => {
          res
            .status(UNAUTHORIZED.error)
            .send({ message: "You are not authorized" });
        });
    });
};

const getCurrentUser = (req, res) => {
  users
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND.error).send({ message: "User not found" });
      }
      res.status(200).send({ data: user });
    })
    .catch(() => {
      res
        .status(DEFAULT.error)
        .send({ message: "An error has occured on the server" });
    });
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  users
    .findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND.error).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(INVALID_DATA.error)
          .send({ message: "Invalid data provided" });
      }
      res
        .status(DEFAULT.error)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
