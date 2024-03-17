const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = {
  Post,
};
