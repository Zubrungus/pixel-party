import express from "express";
import path from "node:path";
import type { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import db from "./config/connection";
import { typeDefs, resolvers } from "./schemas/index";
import { authenticateToken } from "./utils/auth";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3000;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Wrap the authenticateToken to match the context function signature
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: ({ req }: { req: Request }) => authenticateToken(req), // Wrap the authenticateToken
    }) as express.RequestHandler
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
