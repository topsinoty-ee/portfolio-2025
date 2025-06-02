import { MutationResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";
import { GraphQLError } from "graphql";
import { mapDocument } from "@/resolvers/utils";
import { Error as MongooseError, Types } from "mongoose";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
} from "@/resolvers/ERROR_UTILS";

export const ProjectMutations: MutationResolvers = {
  addProject: async (_, { payload }) => {
    if (!payload || Object.keys(payload).length === 0) {
      throw new GraphQLError(ERROR_MESSAGES.EMPTY_PAYLOAD, {
        extensions: {
          code: ERROR_CODES.BAD_REQUEST,
          status: ERROR_STATUS_CODES.BAD_REQUEST,
        },
      });
    }

    try {
      const title = payload.title?.trim();
      if (!title) {
        throw new GraphQLError(ERROR_MESSAGES.REQUIRED_FIELD("title"), {
          extensions: {
            code: ERROR_CODES.BAD_REQUEST,
            status: ERROR_STATUS_CODES.BAD_REQUEST,
          },
        });
      }

      const existing = await Project.findOne({ title })
        .collation({
          locale: "en",
          strength: 2,
        })
        .lean();

      if (existing) {
        throw new GraphQLError(ERROR_MESSAGES.TITLE_EXISTS(title), {
          extensions: {
            code: ERROR_CODES.DUPLICATE_TITLE,
            status: ERROR_STATUS_CODES.DUPLICATE_TITLE,
          },
        });
      }

      const saved = await Project.create({
        ...payload,
        title,
      });

      return mapDocument(saved.toObject());
    } catch (err) {
      if (err instanceof GraphQLError) throw err;

      if (err instanceof MongooseError.ValidationError) {
        throw new GraphQLError("Invalid project data", {
          extensions: {
            code: ERROR_CODES.VALIDATION_ERROR,
            status: ERROR_STATUS_CODES.VALIDATION_ERROR,
            details: Object.values(err.errors).map((e) => e.message),
          },
        });
      }

      throw new GraphQLError(ERROR_MESSAGES.OPERATION_FAILED("add project"), {
        extensions: {
          code: ERROR_CODES.INTERNAL_ERROR,
          status: ERROR_STATUS_CODES.INTERNAL_ERROR,
          originalMessage: err instanceof Error ? err.message : String(err),
        },
      });
    }
  },

  editProject: async (_, { id, payload }) => {
    if (!payload || Object.keys(payload).length === 0) {
      throw new GraphQLError(ERROR_MESSAGES.EMPTY_PAYLOAD, {
        extensions: {
          code: ERROR_CODES.BAD_REQUEST,
          status: ERROR_STATUS_CODES.BAD_REQUEST,
        },
      });
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new GraphQLError(ERROR_MESSAGES.INVALID_ID, {
        extensions: {
          code: ERROR_CODES.BAD_REQUEST,
          status: ERROR_STATUS_CODES.BAD_REQUEST,
        },
      });
    }

    try {
      const updateData = { ...payload };

      if (payload.title !== undefined) {
        const title = payload.title.trim();
        if (!title) {
          throw new GraphQLError(ERROR_MESSAGES.REQUIRED_FIELD("title"), {
            extensions: {
              code: ERROR_CODES.BAD_REQUEST,
              status: ERROR_STATUS_CODES.BAD_REQUEST,
            },
          });
        }

        const existing = await Project.findOne({
          _id: { $ne: id },
          title,
        })
          .collation({ locale: "en", strength: 2 })
          .lean();

        if (existing) {
          throw new GraphQLError(ERROR_MESSAGES.TITLE_EXISTS(title), {
            extensions: {
              code: ERROR_CODES.DUPLICATE_TITLE,
              status: ERROR_STATUS_CODES.DUPLICATE_TITLE,
            },
          });
        }

        updateData.title = title;
      }

      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
          lean: true,
        },
      );

      if (!updatedProject) {
        throw new GraphQLError(
          ERROR_MESSAGES.NOT_FOUND(`project with id: ${id}`),
          {
            extensions: {
              code: ERROR_CODES.NOT_FOUND,
              status: ERROR_STATUS_CODES.NOT_FOUND,
            },
          },
        );
      }

      return mapDocument(updatedProject);
    } catch (err) {
      if (err instanceof GraphQLError) throw err;

      if (err instanceof MongooseError.ValidationError) {
        throw new GraphQLError("Invalid project data", {
          extensions: {
            code: ERROR_CODES.VALIDATION_ERROR,
            status: ERROR_STATUS_CODES.VALIDATION_ERROR,
            details: Object.values(err.errors).map((e) => e.message),
          },
        });
      }

      throw new GraphQLError(ERROR_MESSAGES.OPERATION_FAILED("edit project"), {
        extensions: {
          code: ERROR_CODES.INTERNAL_ERROR,
          status: ERROR_STATUS_CODES.INTERNAL_ERROR,
          originalMessage: err instanceof Error ? err.message : String(err),
        },
      });
    }
  },

  deleteProject: async (_, { id }) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new GraphQLError(ERROR_MESSAGES.INVALID_ID, {
        extensions: {
          code: ERROR_CODES.BAD_REQUEST,
          status: ERROR_STATUS_CODES.BAD_REQUEST,
        },
      });
    }

    try {
      const deleted = await Project.findByIdAndDelete(id).lean();
      if (!deleted) {
        throw new GraphQLError(
          ERROR_MESSAGES.NOT_FOUND(`project with id: ${id}`),
          {
            extensions: {
              code: ERROR_CODES.NOT_FOUND,
              status: ERROR_STATUS_CODES.NOT_FOUND,
            },
          },
        );
      }
      return true;
    } catch (err) {
      throw new GraphQLError(
        ERROR_MESSAGES.OPERATION_FAILED("delete project"),
        {
          extensions: {
            code: ERROR_CODES.INTERNAL_ERROR,
            status: ERROR_STATUS_CODES.INTERNAL_ERROR,
            originalMessage: err instanceof Error ? err.message : String(err),
          },
        },
      );
    }
  },
};
