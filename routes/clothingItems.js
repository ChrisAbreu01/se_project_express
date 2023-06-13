const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    createItem,
    getItems,
    deleteItem,
    likeItem,
    disLikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, createItem);
router.get("/", getItems);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId", auth, deleteItem);
router.delete("/:itemId/likes", auth, disLikeItem);

module.exports = router;