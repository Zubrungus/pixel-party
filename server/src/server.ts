import express from "express";
import path from "node:path";
import http from "http";
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

import { ApolloServer, BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import db from "./config/connection.js";
import { typeDefs, resolvers } from "./schemas/index.js";
// import { authenticateToken } from "./utils/auth.js";

interface IUser {
  username: string;
  password: string;
  createdAt: Date;
}

interface IConnectionContext extends BaseContext {
  user?: IUser | null;
  isSubscription?: boolean;
}


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
    context: async (/*connectionContext*/) => {
      // Add authentication for subscriptions here
      return { 
        // For now, we're not requiring authentication for subscriptions
        isSubscription: true
      } as IConnectionContext;
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

  app.use(
    "/graphql",

    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        // Ensure `authenticateToken` returns the user data
        const user = await authenticateToken(req); // Assuming this returns a promise
        return { user }; // Return the resolved user directly
      },
    }) as express.RequestHandler

    expressMiddleware(server/*, {
      context: ({ req }: { req: Request }): any => authenticateToken(req), // Wrap the authenticateToken
    }*/) as express.RequestHandler

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
