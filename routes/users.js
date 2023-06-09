const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    // getUsers, 
    // getUser, 
    // createUser
} = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateCurrentUser);

module.exports = router;