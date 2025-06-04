import { Resolvers } from "../generated/graphql";
import { ProjectResolver } from "@/resolvers/project";
import { UserResolver } from "@/resolvers/user";

const resolvers: Resolvers = {
  ...ProjectResolver,
  // ...UserResolver,
};

export { resolvers };
