import express from "express";
import path from "node:path";
import http from "http";
import type { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import db from "./config/connection";
import { typeDefs, resolvers } from "./schemas/index";
import { authenticateToken } from "./utils/auth";

const startApolloServer = async () => {
  await db();

  const PORT = process.env.PORT || 3000;
  const app = express();
  const httpServer = http.createServer(app);

  // Create schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Use WebSocket server with graphql-ws
  const serverCleanup = useServer({ 
    schema,
    // Context for WebSocket connections
    context: async (ctx) => {
      // You could add authentication for subscriptions here
      return { 
        // For now, we're not requiring authentication for subscriptions
        isSubscription: true
      };
    }
  }, wsServer);

  // Create Apollo Server with WebSocket plugin
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

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

  httpServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket server ready at ws://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
