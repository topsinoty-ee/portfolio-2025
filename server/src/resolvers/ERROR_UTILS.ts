export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  DUPLICATE_TITLE: "DUPLICATE_TITLE",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const ERROR_MESSAGES = {
  EMPTY_PAYLOAD: "Payload cannot be empty",
  INVALID_ID: "Invalid project ID",
  TITLE_REQUIRED: "Title is required",
  TITLE_EXISTS: (title: string) => `Project title "${title}" already exists`,
  PROJECT_NOT_FOUND: "Project not found",
  FAILED_ADD: "Failed to add project",
  FAILED_EDIT: "Failed to edit project",
  FAILED_DELETE: "Failed to delete project",
} as const;
