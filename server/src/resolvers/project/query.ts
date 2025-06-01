import { QueryResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";

export const ProjectQueries: QueryResolvers = {
  projects: async () => {
    const projects = await Project.find().lean();
    const mappedProjs = projects.map(({ _id, ...project }) => ({
      id: _id.toString(),
      ...project,
    }));
    console.log(mappedProjs);

    return mappedProjs;
  },
  project: async (_, { title }) => {
    const project = await Project.findOne({ title });
    if (!project) return null;
    return { id: project._id.toString(), ...project };
  },
};
