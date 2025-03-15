import express from "express";
import path from "node:path";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas";
import { authenticateToken } from "./utils/auth";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  const PORT = process.env.PORT || 3000;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => authenticateToken(req),
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`✅ API server running on port ${PORT}!`);
    console.log(`🚀 GraphQL available at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
