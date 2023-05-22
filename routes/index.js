const router = require("express").Router();
const { NOTFOUND } = require("../utils/errors");
const clothingItem = require("./clothingItems");
const users = require("./users");
router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  res.status(NOTFOUND).send({ message: "Router not found" });
});

module.exports = router;
