import { MutationResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";
import { GraphQLError } from "graphql";
import { mapDocument } from "@/resolvers/utils";
import { Error as MongooseError, Types } from "mongoose";

export const ProjectMutations: MutationResolvers = {
  addProject: async (_, { payload }) => {
    if (!payload || Object.keys(payload).length === 0) {
      throw new GraphQLError("Project payload is required", {
        extensions: { code: "BAD_REQUEST", status: 400 },
      });
    }

    try {
      const existing = await Project.findOne({
        title: payload.title,
      }).collation({ locale: "en", strength: 2 });

      if (existing) {
        throw new GraphQLError("Title already exists", {
          extensions: { code: "DUPLICATE_TITLE", status: 409 },
        });
      }

      const saved = await Project.create(payload);
      return mapDocument(saved);
    } catch (err) {
      if (err instanceof GraphQLError) {
        throw err;
      }
      if (err instanceof MongooseError.ValidationError) {
        throw new GraphQLError("Invalid project data", {
          extensions: {
            code: "VALIDATION_ERROR",
            status: 400,
            details: err.errors,
          },
        });
      }
      throw new GraphQLError("Failed to add project", {
        extensions: {
          code: "INTERNAL_ERROR",
          status: 500,
          originalMessage: err instanceof Error ? err.message : String(err),
        },
      });
    }
  },

  editProject: async (_, { id, payload }) => {
    if (!payload || Object.keys(payload).length === 0) {
      throw new GraphQLError("New project payload is required", {
        extensions: { code: "BAD_REQUEST", status: 400 },
      });
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new GraphQLError("Invalid project ID", {
        extensions: { code: "BAD_REQUEST", status: 400 },
      });
    }

    try {
      if (payload.title) {
        const existing = await Project.findOne({
          _id: { $ne: id },
          title: payload.title,
        }).collation({ locale: "en", strength: 2 });

        if (existing) {
          throw new GraphQLError("Title already exists", {
            extensions: { code: "DUPLICATE_TITLE", status: 409 },
          });
        }
      }

      const updatableProject = await Project.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true },
      );

      if (!updatableProject) {
        throw new GraphQLError("Project not found", {
          extensions: { code: "NOT_FOUND", status: 404 },
        });
      }

      return mapDocument(updatableProject);
    } catch (err) {
      if (err instanceof GraphQLError) {
        throw err;
      }
      if (err instanceof MongooseError.ValidationError) {
        throw new GraphQLError("Invalid project data", {
          extensions: {
            code: "VALIDATION_ERROR",
            status: 400,
            details: err.errors,
          },
        });
      }
      throw new GraphQLError("Failed to edit project", {
        extensions: {
          code: "INTERNAL_ERROR",
          status: 500,
          originalMessage: err instanceof Error ? err.message : String(err),
        },
      });
    }
  },

  deleteProject: async (_, { id }: { id: string }) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new GraphQLError("Invalid project ID", {
        extensions: { code: "BAD_REQUEST", status: 400 },
      });
    }

    try {
      const deleted = await Project.findByIdAndDelete(id);
      if (!deleted) {
        throw new GraphQLError("Project not found", {
          extensions: { code: "NOT_FOUND", status: 404 },
        });
      }
      return true;
    } catch (err) {
      throw new GraphQLError("Failed to delete project", {
        extensions: {
          code: "INTERNAL_ERROR",
          status: 500,
          originalMessage: err instanceof Error ? err.message : String(err),
        },
      });
    }
  },
};
