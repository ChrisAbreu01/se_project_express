const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { validateProfileAvatar } = require("../middlewares/validation");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateProfileAvatar, updateCurrentUser);

module.exports = router;
