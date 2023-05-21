const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItems");
//CRUD

// create
router.post("/", createItem);

//read
router.get("/", getItems);
//update
router.put("/:itemId", updateItem);
router.put("/:itemId/likes", likeItem);
//delete\
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", disLikeItem);

module.exports = router;
