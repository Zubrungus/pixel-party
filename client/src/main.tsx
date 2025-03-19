import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import "./index.css";
import App from "./App.tsx";

// Create an HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql", // Updated port to match server
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Ensures token is included
    },
  };
});

// Create a WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3000/graphql", // Updated port to match server
    connectionParams: {
      authToken: localStorage.getItem("id_token"),
    },
    retryAttempts: 5, // Add retry attempts
    shouldRetry: () => true, // Always retry on disconnect
    onNonLazyError: error => console.error('WebSocket error:', error)
  })
);

// Use split to route requests based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Initialize Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
