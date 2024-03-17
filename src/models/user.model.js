const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // array of user id that are following
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
