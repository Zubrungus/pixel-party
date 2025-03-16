import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import db from "./config/connection";
import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      return { token };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log(
      `🚀 Server running at http://localhost:3000${server.graphqlPath}`
    );
  });
};

startServer();
