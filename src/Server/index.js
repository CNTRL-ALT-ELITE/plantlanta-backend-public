import { GraphQLServer } from "graphql-yoga";
import { types, resolvers } from "../graphql";
import { connectToMongoDB } from "../MongoDB";
// import { resolveUser } from "./resolveUser";

// const types = require("./schema.graphql");

export const createServer = (stripe, shippo) => {
  const db = connectToMongoDB();

  return new GraphQLServer({
    typeDefs: types,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: async (req, res) => {
      let context = { jwtToken: "" };
      if (req.connection) {
        context = req.connection.context;
      } else if (req.request.header("authorization")) {
        context.jwtToken = req.request.header("authorization") || "";
      }

      return {
        ...req,
        ...res,
        db,
        stripe,
        shippo
        // user: resolveUser(context)
      };
    }
  });
};
