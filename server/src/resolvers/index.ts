import { Resolvers } from "../generated/graphql";
import { ProjectResolver } from "@/resolvers/project";

const resolvers: Resolvers = {
  ...ProjectResolver,
};

export { resolvers };
