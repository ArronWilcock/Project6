// mongoose package required
const mongoose = require("mongoose");

// mongoose schema created for the sauce object. Img Url required set to false to allow a sauce to be created without an image
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
  imageUrl: { type: String, required: false },
  mainPepper: { type: String, required: true },
  userId: { type: String, required: true },
});

// mongoose model named Sauce and exported to be used in the express app
module.exports = mongoose.model("Sauce", sauceSchema);
