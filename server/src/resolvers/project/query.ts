import { QueryResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";
import { mapDocument } from "@/resolvers/utils";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";

export const ProjectQueries: QueryResolvers = {
  projects: async () => {
    const projects = await Project.find().lean();
    return projects.map(mapDocument);
  },

  project: async (_, { selector }) => {
    const query = Types.ObjectId.isValid(selector)
      ? { _id: selector }
      : { title: selector };

    const project = await Project.findOne(query);
    if (!project) {
      throw new GraphQLError("Project not found", {
        extensions: { code: "NOT_FOUND", status: 404 },
      });
    }

    return mapDocument(project);
  },
};
