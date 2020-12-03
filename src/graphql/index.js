import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

const typesArray = fileLoader(path.join(__dirname, "/**/**/*.graphql"));

export const types = mergeTypes(typesArray, { all: true });

console.log(types);

const resolversArray = fileLoader(
  path.join(__dirname, "./**/**/*.resolvers.*")
);

export const resolvers = mergeResolvers(resolversArray);
