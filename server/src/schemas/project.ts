import { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true },
    link: { type: String, trim: true },
    repo: { type: String, unique: true, trim: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: "version" },
);

projectSchema.index({ title: 1, repo: 1 }, { unique: true });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ lastUpdatedBy: 1 });

export const Project = model("Project", projectSchema);
