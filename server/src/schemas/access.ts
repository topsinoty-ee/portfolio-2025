import { model, Schema } from "mongoose";

const projectAccessSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    overrides: {
      canRead: { type: Boolean },
      canWrite: { type: Boolean },
      canComment: { type: Boolean },
      canManageAccess: { type: Boolean },
      canDelete: { type: Boolean },
    },
  },
  { timestamps: true },
);

projectAccessSchema.index({ user: 1, project: 1 }, { unique: true });

export const ProjectAccess = model("ProjectAccess", projectAccessSchema);
