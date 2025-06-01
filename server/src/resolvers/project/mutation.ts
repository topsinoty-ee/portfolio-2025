import { MutationResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";

export const ProjectMutations: MutationResolvers = {
  addProject: async (_, { data }) => {
    const savedProject = await Project.create(data);

    const { _id, ...rest } = savedProject.toObject();
    return {
      id: _id.toString(),
      ...rest,
    };
  },
  editProject: async (_, { id, data }) => {
    return Project.findByIdAndUpdate(id, { $set: data }, { new: true });
  },
};
