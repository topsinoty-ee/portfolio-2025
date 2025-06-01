import { MutationResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";

export const ProjectMutations: MutationResolvers = {
  addProject: async (_, { data }) => {
    try {
      const savedProject = await Project.create(data);
      if (!savedProject) {
        return {
          success: false,
          project: null,
          error: "Failed to save project",
        };
      }
      const { _id, ...rest } = savedProject.toObject();
      return {
        success: true,
        project: { id: _id.toString(), ...rest },
        error: null,
      };
    } catch (error) {
      return { success: false, project: null, error: (error as Error).message };
    }
  },

  editProject: async (_, { id, data }) => {
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true },
      );
      if (!updatedProject) {
        return { success: false, project: null, error: "Project not found" };
      }
      const { _id, ...rest } = updatedProject.toObject();
      return {
        success: true,
        project: { id: _id.toString(), ...rest },
        error: null,
      };
    } catch (error) {
      return { success: false, project: null, error: (error as Error).message };
    }
  },

  deleteProject: async (_, { id }) => {
    try {
      const deletedProject = await Project.findByIdAndDelete(id);
      if (!deletedProject) {
        return { success: false, reason: "Project not found" };
      }
      return { success: true, reason: null };
    } catch (error) {
      return { success: false, reason: (error as Error).message };
    }
  },
};
