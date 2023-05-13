// required packages declared. Unique validator installed to ensure each user has a unique email
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// mongoose User schema created for sign up/log in with the email requiring 'unique: true'
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// unique user validator called
userSchema.plugin(uniqueValidator);

// mongoose model named User and exported to be used in the express app
module.exports = mongoose.model("User", userSchema);
