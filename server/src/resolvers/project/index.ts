import {ProjectResolvers} from "@/generated/graphql";
import {ProjectQueries} from "@/resolvers/project/query";
import {ProjectMutations} from "@/resolvers/project/mutation";

export const ProjectResolver: ProjectResolvers = {
  Query: {...ProjectQueries},
  Mutation: {...ProjectMutations},
};
