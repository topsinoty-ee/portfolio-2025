import { model, Schema } from "mongoose";

const projectSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  link: { type: String },
  repo: String,
});

export const Project = model("Project", projectSchema);
