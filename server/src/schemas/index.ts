import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import { PubSub } from "graphql-subscriptions";

// Create a shared PubSub instance
export const pubsub = new PubSub();

export { typeDefs, resolvers };
