const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    _id: ID!
    username: String!
    email: String!
    following: [User]!
  }

  type Post {
    _id: ID!
    author: User!
    content: String!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User!
    post(id: ID!): Post!
    users: [User!]!
    posts: [Post!]!
    currentUserPosts(userId: ID!): [Post!]!
    followingPosts(userId: ID!): [Post!]!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    followUser(userId: ID!, targetUserId: ID!): User!
    unfollowUser(userId: ID!, targetUserId: ID!): User!
    createPost(authorId: ID!, content: String!): Post!
  }
`);

module.exports = {
  schema,
};
