export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATE_TITLE: "DUPLICATE_TITLE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  NO_CHANGES_MADE: "NO_CHANGES_MADE",
} as const;

export const ERROR_MESSAGES = {
  OPERATION_FAILED: (operation: string) => `Failed to ${operation}`,
  NOT_FOUND: (resource: string) => `${resource} not found`,
  ALREADY_EXISTS: (resource: string) => `${resource} already exists`,
  INVALID_INPUT: (field?: string) =>
    field ? `Invalid ${field}` : "Invalid input",
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  EMPTY_PAYLOAD: "Payload cannot be empty",
  INVALID_ID: "Invalid ID format",
  TITLE_EXISTS: (title: string) => `Project title "${title}" already exists`,
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  FORBIDDEN_ACTION: "Forbidden action",
  DATABASE_ERROR: "Database operation failed",
  NETWORK_ERROR: "Network communication failed",
  NO_CHANGES_MADE: "No changes made. Body might be identical to existing",
} as const;

export const ERROR_STATUS_CODES: Record<keyof typeof ERROR_CODES, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  DUPLICATE_TITLE: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  NOT_IMPLEMENTED: 501,
  NO_CHANGES_MADE: 422,
} as const;
