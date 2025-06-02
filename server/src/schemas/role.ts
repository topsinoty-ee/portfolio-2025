import { model, Schema } from "mongoose";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["admin", "collaborator", "guest"],
      unique: true,
    },
    permissions: {
      canRead: { type: Boolean, default: false },
      canWrite: { type: Boolean, default: false },
      canComment: { type: Boolean, default: false },
      canManageAccess: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false },
    },
    description: { type: String },
  },
  { timestamps: true },
);

export const Role = model("Role", roleSchema);
