const typeDefs = `
  type User {
    username: String!
    password: String!
    createdAt: String!
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
    createUser(username: String!, password: String!): User
    createPixel(userId: ID!, x: Int!, y: Int!, color: String!): Pixel
    setCooldown(userId: ID!): Cooldown
  }

  type Subscription {
    pixelUpdated: Pixel
  }
`;

export default typeDefs;
