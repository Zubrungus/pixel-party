import express from "express";
import path from "node:path";
import http from "http";
import type { Request, Response } from "express";

import db from "./config/connection.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from "./utils/auth.js";



import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

const startApolloServer = async () => {
  await db();

  const PORT = process.env.PORT || 3001;
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
    context: async (_connectionContext) => {
      // Log connection for debugging
      console.log('WebSocket connection established');
      
      // For now, we're not requiring authentication for subscriptions
      return { 
        isSubscription: true
      };
    },
    onConnect: (_ctx) => {
      console.log('Client connected to WebSocket');
      return true;
    },
    onDisconnect: (_ctx) => {
      console.log('Client disconnected from WebSocket');
    },
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

  app.use(
    "/graphql",

    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        // Get authenticated user from token
        try {
          const user = await authenticateToken(req);
          return { user }; // User will be null if not authenticated
        } catch (error) {
          console.error("Authentication error:", error);
          return { user: null }; // Ensure user is null on error
        }
      },
    }) as express.RequestHandler
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../client/dist")));

    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
    });
  }

  httpServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket server ready at ws://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
