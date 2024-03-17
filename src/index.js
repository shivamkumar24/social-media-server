const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db");
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { graphqlHTTP } = require("express-graphql");
const { authMiddleware } = require("./utils/auth");
const { validateInputs } = require("./utils/validation");
const { createPost } = require("./controllers/postController");
const {
  registerUser,
  loginUser,
  getUserPosts,
  getAllUsers,
  getFollowingPosts,
  followUser,
  unfollowUser,
} = require("./controllers/userController");

const app = express();

app.use(express.json());
app.use(cors());

app.use(authMiddleware);

// GraphQL endpoint
app.use(
  "/graphql",
  validateInputs,
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

// routes (endpoints)
app.post("/register", registerUser);

app.post("/login", loginUser);

app.post("/post", createPost);

app.get("/user/posts/:userId", getUserPosts); // Get posts for a user by userID

app.get("/allusers", getAllUsers);

app.get("/following/posts/:userId", getFollowingPosts); // Get all including those post which is posted by user following

app.post("/follow", followUser);

app.post("/unfollow", unfollowUser);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to the Database");
  } catch (error) {
    console.log("Connection Error:", error);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
