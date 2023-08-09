const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const {
  validateUserCreation,
  validateAuth,
} = require("../middlewares/validation");
const { NOTFOUND } = require("../utils/errors");
const clothingItem = require("./clothingItems");
const authorization = require("../middlewares/auth");
const users = require("./users");

router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateAuth, login);

router.use("/items", clothingItem);
router.use("/users", authorization, users);

router.use((req, res) => {
  res.status(NOTFOUND.error).send({ message: "Router not found" });
});

module.exports = router;
