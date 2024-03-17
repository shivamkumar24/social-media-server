const User = require("../models/user.model");
const Post = require("../models/post.model");

const resolvers = {
  user: async ({ id }) => await User.findById(id).populate("following"),
  post: async ({ id }) => await Post.findById(id),
  users: async () => await User.find().populate("following"),
  posts: async () => await Post.find(),

  createUser: async ({ username, email, password }) => {
    const user = new User({ username, email, password });
    await user.save();
    return user;
  },

  followUser: async ({ userId, targetUserId }) => {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      throw new Error("User not found");
    }

    if (!user.following.includes(targetUser._id)) {
      user.following.push(targetUser._id);
      await user.save();
    }

    return user;
  },

  unfollowUser: async ({ userId, targetUserId }) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.following = user.following.filter(
      (followedUser) => followedUser.toString() !== targetUserId
    );
    await user.save();

    return user;
  },

  currentUserPosts: async ({ userId }) => {
    const posts = await Post.find({ author: userId });
    return posts;
  },

  followingPosts: async ({ userId }) => {
    const currentUser = await User.findById(userId);
    const followingUsers = currentUser.following;
    const posts = await Post.find({ author: { $in: followingUsers } });
    return posts;
  },

  createPost: async ({ authorId, content }) => {
    const post = new Post({ author: authorId, content });
    await post.save();
    return post;
  },
};

module.exports = {
  resolvers,
};
