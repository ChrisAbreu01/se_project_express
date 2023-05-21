const users = require("../models/users");
const { DEFAULT, INVALID_DATA, NOTFOUND } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  users
    .create({ name, avatar })
    .then((user) => {
      console.log("this is the user" + user);
      res.send({ data: user });
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
          .status(DEFAULT.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};
const getUsers = (req, res) => {
  users
    .find({})
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

  users
    .findById(userId)
    .then((item) => {
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

module.exports = {
  createUser,
  getUsers,
  getUser,
};
