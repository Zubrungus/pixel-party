const typeDefs = `
  type User {
    _id: ID!
    username: String!
    password: String!
    createdAt: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Pixel {
    userId: ID!
    x: Int!
    y: Int!
    color: String!
    placedAt: String!
  }

  type Cooldown {
    userId: ID!
    lastPlacedAt: String!
  }

  type Query {
    getUser(username: String!): User
    getPixels(userId: ID!): [Pixel]
    getAllPixels: [Pixel]
    getCooldown(userId: ID!): Cooldown
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    signup(username: String!, password: String!): Auth
    createPixel(x: Int!, y: Int!, color: String!): Pixel
    setCooldown(userId: ID!): Cooldown
  }

  type Subscription {
    pixelUpdated: Pixel
  }
`;

export default typeDefs;
