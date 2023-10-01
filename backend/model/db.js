const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
  },
  likeCount: {
    type: Number,
    default: 0, // Initialize the like count to 0
  },
});
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: String,
});
const User = mongoose.model("Signup", signupSchema);
const Like = mongoose.model("Like", likeSchema);

module.exports = { User, Like };
