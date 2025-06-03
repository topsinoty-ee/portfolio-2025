import { UserResolvers } from "@/generated/graphql";
import { UserQueries } from "@/resolvers/user/query";
import { UserMutations } from "@/resolvers/user/mutation";

export const UserResolver: UserResolvers = {
  Query: { ...UserQueries },
  Mutation: { ...UserMutations },
};
