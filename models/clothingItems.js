const mongoose = require("mongoose");
var validator = require("validator");

const clothingItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: String,
    // required: true,
  },
  likes: [
    {
      type: String,
      // required: true,
    },
  ],
  createdAt: {
    type: Date,
    // required: true,
  },
});
module.exports = mongoose.model("clothingItem", clothingItemsSchema);
