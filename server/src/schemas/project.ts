import { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true },
    link: { type: String, trim: true },
    repo: { type: String, unique: true, trim: true },
  },
  { timestamps: true, versionKey: "version" },
);

export const Project = model("Project", projectSchema);
