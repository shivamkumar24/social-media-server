const { Post } = require("../models/post.model");

const createPost = async (req, res) => {
  const { authorId, content } = req.body;
  console.log("DataBack", req.body);

  try {
    const post = new Post({ author: authorId, content });
    await post.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPost,
};
