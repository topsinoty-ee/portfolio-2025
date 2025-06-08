import { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true },
    link: { type: String, trim: true },
    repo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: (v: string) =>
          /^(https:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]{1,100}\/[a-zA-Z0-9_-]{1,100}(?:\.git)?\/?$/.test(
            v,
          ),
        message:
          "Must be a valid GitHub repo URL (e.g., 'https://github.com/user/repo')",
      },
    },
    for: {
      type: String,
      sparse: true,
      immutable: true,
    },
    skillsRequired: [
      {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function (v: string) {
            return v.length > 0 && v.length <= 64;
          },
          message: "Skill must be between 1 and 64 characters",
        },
      },
    ],
    collaborators: [
      {
        type: String,
        required: true,
        validate: {
          validator: function (v: string) {
            return /.+@.+\..+/.test(v);
          },
          message: "Collaborator must be a valid email",
        },
      },
    ],
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    accessList: [{ type: Schema.Types.ObjectId, ref: "ProjectAccess" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  },
  { versionKey: "version", timestamps: true, minimize: true },
);

projectSchema.index({ title: 1, repo: 1 });
projectSchema.index({ collaborators: 1, isArchived: 1 });
projectSchema.index({ lastUpdatedBy: 1 });
projectSchema.index({ skillsRequired: 1 });

let originalCollaborators: string[] = [];

projectSchema.pre("save", function () {
  if (!this.isNew) {
    originalCollaborators = [...(this.collaborators ?? [])];
  }
});

projectSchema.post("save", async function (project) {
  if (this.isNew || this.isModified("collaborators")) {
    try {
      const current = project.collaborators;
      const previous = this.isNew ? [] : originalCollaborators;

      await project.db
        .model("User")
        .updateMany(
          { email: { $in: current } },
          { $addToSet: { contributions: project._id } },
        );

      await project.db
        .model("User")
        .updateMany(
          { email: { $in: previous.filter((p) => !current.includes(p)) } },
          { $pull: { contributions: project._id } },
        );
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Error updating user contributions: " + error);
    }
  }
});

projectSchema.pre("deleteOne", { document: true }, async function () {
  try {
    await this.db
      .model("User")
      .updateMany(
        { contributions: this._id },
        { $pull: { contributions: this._id } },
      );
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Error cleaning up project references: " + error);
  }
});

export const Project = model("Project", projectSchema);
