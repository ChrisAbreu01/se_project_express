const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const { NOTFOUND } = require("../utils/errors");
const clothingItem = require("./clothingItems");
const users = require("./users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
    res.status(NOTFOUND.error).send({ message: "Router not found" });
});

module.exports = router;