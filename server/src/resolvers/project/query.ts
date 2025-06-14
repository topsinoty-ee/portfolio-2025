import { ProjectFilter, QueryResolvers } from "@/generated/graphql";
import { Project } from "@/schemas/project";
import { mapDocument } from "@/resolvers/utils";
import { FilterQuery, InferSchemaType, Types } from "mongoose";
import { GraphQLError } from "graphql";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
} from "@/resolvers/ERROR_UTILS";

type ProjectDocument = InferSchemaType<typeof Project.schema>;

export const ProjectQueries: QueryResolvers = {
  projects: async (_, { filterBy }) => {
    const filter = (input?: ProjectFilter): FilterQuery<ProjectDocument> => {
      if (!input) return {};

      const {
        isArchived,
        skillsRequired,
        isFeatured,
        for: forWhom,
        collaborators,
        title,
      } = input;

      const mongoFilter: FilterQuery<ProjectDocument> = {
        isArchived: isArchived ?? false,
      };

      if (skillsRequired?.length) {
        mongoFilter.skillsRequired = { $all: skillsRequired };
      }

      if (typeof isFeatured === "boolean") {
        mongoFilter.isFeatured = isFeatured;
      }

      if (forWhom) {
        mongoFilter.for = forWhom;
      }

      if (collaborators?.length) {
        mongoFilter.collaborators = { $in: collaborators };
      }

      if (title) {
        const cleaned = title.replace(/[-_\s]+/g, ".*");
        mongoFilter.title = {
          $regex: new RegExp(cleaned, "i"),
        };
      }

      return mongoFilter;
    };
    const mongoFilter = filter(filterBy);

    try {
      const projects = await Project.find(mongoFilter).lean();
      if (!projects || projects.length === 0) {
        return [];
      }
      return projects.map(mapDocument);
    } catch (err) {
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
