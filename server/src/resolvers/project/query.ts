import { QueryResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";
import { mapDocument } from "@/resolvers/utils";
import { Types } from "mongoose";
import { GraphQLError } from "graphql";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
} from "@/resolvers/ERROR_UTILS";

export const ProjectQueries: QueryResolvers = {
  projects: async () => {
    try {
      const projects = await Project.find().lean();
      return projects.map(mapDocument);
    } catch (err) {
      if (err instanceof GraphQLError) throw err;
      throw new GraphQLError(
        ERROR_MESSAGES.OPERATION_FAILED("fetch projects"),
        {
          extensions: {
            code: ERROR_CODES.INTERNAL_ERROR,
            status: 500,
            originalMessage: err instanceof Error ? err.message : String(err),
          },
        },
      );
    }
  },

  project: async (_, { id }) => {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new GraphQLError(ERROR_MESSAGES.INVALID_ID, {
        extensions: { code: ERROR_CODES.BAD_REQUEST, status: 400 },
      });
    }

    try {
      const project = await Project.findById(new Types.ObjectId(id)).lean();

      if (!project) {
        throw new GraphQLError(ERROR_MESSAGES.NOT_FOUND("project"), {
          extensions: {
            code: ERROR_CODES.NOT_FOUND,
            status: 404,
          },
        });
      }

      return mapDocument(project);
    } catch (err) {
      if (err instanceof GraphQLError) throw err;

      throw new GraphQLError(ERROR_MESSAGES.OPERATION_FAILED("fetch project"), {
        extensions: {
          code: ERROR_CODES.INTERNAL_ERROR,
          status: ERROR_STATUS_CODES.INTERNAL_ERROR,
          originalMessage: err instanceof Error ? err.message : String(err),
        },
      });
    }
  },
};
