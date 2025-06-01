import { QueryResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";
import { mapDocument } from "@/resolvers/utils";

export const ProjectQueries: QueryResolvers = {
  projects: async () => {
    const projects = await Project.find().lean();
    return projects.map(mapDocument);
  },

  project: async (_, { title }) => {
    const project = await Project.findOne({ title }).lean();
    return project ? mapDocument(project) : null;
  },
};
