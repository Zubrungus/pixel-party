import express from "express";
import path from "node:path";
import type { Request, Response } from "express";
import db from "./config/connection";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas/index";
import { authenticateToken } from "./utils/auth";
import { GraphQLContext } from "./models/GraphQlContext"; // Import the GraphQLContext type

const server = new ApolloServer<GraphQLContext>({
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

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        // Ensure `authenticateToken` returns the user data
        const user = await authenticateToken(req); // Assuming this returns a promise
        return { user }; // Return the resolved user directly
      },
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
