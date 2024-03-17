const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/auth");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Checking if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Creating a new user
    bcrypt.hash(password, 5, async (error, hash) => {
      const user = new User({ username, email, password: hash });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          res.status(200).send({
            message: "User Login Successfully",
            token: jwt.sign({ userID: user._id }, "socials"),
            user: user,
          });
        } else {
          res.status(400).send({ message: "Wrong Credentials" });
        }
      });
    }
  } catch (error) {
    console.error("Error login user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserPosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userPosts = await Post.find({ author: userId });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowingPosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    const followingUsers = user.following;
    const followingPosts = await Post.find({ author: { $in: followingUsers } });
    res.status(200).json(followingPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const followUser = async (req, res) => {
  const { userId, targetUserId } = req.body;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.following.includes(targetUser._id)) {
      user.following.push(targetUser._id);
      await user.save();
    }
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.following = user.following.filter(
      (followedUser) => followedUser.toString() !== targetUserId
    );
    await user.save();
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserPosts,
  getAllUsers,
  getFollowingPosts,
  followUser,
  unfollowUser,
};
