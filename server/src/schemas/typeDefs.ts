import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    createdAt: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(username: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
  }
`;

export default typeDefs;
