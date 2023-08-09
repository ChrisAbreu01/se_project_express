const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItems");
const { validateCard, validateId } = require("../middlewares/validation");

router.post("/", auth, validateCard, createItem);
router.get("/", getItems);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId", auth, validateId, deleteItem);
router.delete("/:itemId/likes", auth, validateId, disLikeItem);

module.exports = router;
