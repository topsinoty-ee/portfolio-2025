import {
  MutationResolvers,
  ProjectInput,
  ProjectUpdateInput,
} from "@/generated/graphql";
import { Project } from "@/schemas/project";
import { GraphQLError } from "graphql";
import { mapDocument } from "@/resolvers/utils";
import { Error as MongooseError, Types } from "mongoose";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
} from "@/resolvers/ERROR_UTILS";

function checkIfUserIsAdmin(isAdmin: boolean | undefined | null): boolean {
  if (!isAdmin)
    throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, {
      extensions: {
        code: ERROR_CODES.UNAUTHORIZED,
        status: ERROR_STATUS_CODES.UNAUTHORIZED,
      },
    });
  return true;
}

function checkIfPayloadIsEmpty(
  payload: ProjectInput | ProjectUpdateInput,
): boolean {
  if (!payload || Object.keys(payload).length === 0) {
    throw new GraphQLError(ERROR_MESSAGES.EMPTY_PAYLOAD, {
      extensions: {
        code: ERROR_CODES.BAD_REQUEST,
        status: ERROR_STATUS_CODES.BAD_REQUEST,
      },
    });
  }
  return true;
}

export const ProjectMutations: MutationResolvers = {
  createProject: async (_, { payload }, { auth }) => {
    checkIfUserIsAdmin(auth.user?.isAdmin);
    checkIfPayloadIsEmpty(payload);
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
      const skills = payload.skillsRequired;
      if (!skills || !!!skills.length)
        throw new GraphQLError(ERROR_MESSAGES.REQUIRED_FIELD("skills"), {
          extensions: {
            code: ERROR_CODES.BAD_REQUEST,
            status: ERROR_STATUS_CODES.BAD_REQUEST,
          },
        });

      const saved = await Project.create({
        ...payload,
        description: payload.description?.trim() ?? "",
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
  updateProject: async (_, { id, payload }, { auth }) => {
    checkIfUserIsAdmin(auth.user?.isAdmin);
    checkIfPayloadIsEmpty(payload);
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

        const existingWithSameId = await Project.findOne({
          _id: { $ne: id },
          title,
        })
          .collation({ locale: "en", strength: 2 })
          .lean();

        if (existingWithSameId) {
          throw new GraphQLError(ERROR_MESSAGES.TITLE_EXISTS(title), {
            extensions: {
              code: ERROR_CODES.DUPLICATE_TITLE,
              status: ERROR_STATUS_CODES.DUPLICATE_TITLE,
            },
          });
        }

        updateData.title = title;
      }

      const existing = await Project.findOne({ _id: id }).lean();
      if (!existing) {
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
      if (existing.isArchived) {
        const isUnarchivingRequest =
          Object.keys(payload).length === 1 && payload.isArchived === false;
        if (!isUnarchivingRequest) {
          throw new GraphQLError(
            `${ERROR_MESSAGES.FORBIDDEN_ACTION}. Project is archived`,
            {
              extensions: {
                code: ERROR_CODES.FORBIDDEN,
                status: ERROR_STATUS_CODES.FORBIDDEN,
              },
            },
          );
        }
      }

      const hasChanges = Object.keys(updateData).some(
        (key) =>
          JSON.stringify(existing[key]) !== JSON.stringify(updateData[key]),
      );

      if (!hasChanges) {
        throw new GraphQLError(ERROR_MESSAGES.NO_CHANGES_MADE, {
          extensions: {
            code: ERROR_CODES.NO_CHANGES_MADE,
            status: ERROR_STATUS_CODES.NO_CHANGES_MADE,
          },
        });
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

      throw new GraphQLError(
        ERROR_MESSAGES.OPERATION_FAILED("update project"),
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
  deleteProject: async (_, { id }, { auth }) => {
    checkIfUserIsAdmin(auth.user?.isAdmin);
    if (!Types.ObjectId.isValid(id)) {
      throw new GraphQLError(ERROR_MESSAGES.INVALID_ID, {
        extensions: {
          code: ERROR_CODES.BAD_REQUEST,
          status: ERROR_STATUS_CODES.BAD_REQUEST,
        },
      });
    }

    try {
      const project = await Project.findById(id).lean();
      if (!project.isArchived)
        throw new GraphQLError(
          `${ERROR_MESSAGES.FORBIDDEN_ACTION}. Project is not archived`,
          {
            extensions: {
              code: ERROR_CODES.FORBIDDEN,
              status: ERROR_STATUS_CODES.FORBIDDEN,
            },
          },
        );
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
      if (err instanceof GraphQLError) throw err;
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
