import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { createPubSub } from "graphql-ws";

// Create a shared PubSub instance
export const pubsub = createPubSub();

export { typeDefs, resolvers };
