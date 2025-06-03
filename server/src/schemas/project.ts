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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
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
    accessList: [{ type: Schema.Types.ObjectId, ref: "ProjectAccess" }],
  },
  { versionKey: "version", timestamps: true },
);

projectSchema.index({ title: 1, repo: 1 });
projectSchema.index({ collaborators: 1, isArchived: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ lastUpdatedBy: 1 });

let originalCollaborators: string[] = [];

projectSchema.pre("save", function () {
  if (!this.isNew) {
    originalCollaborators = [...(this.collaborators || [])];
  }
});

projectSchema.post("save", async function (project) {
  if (this.isNew || !this.isModified("collaborators")) return;

  const current = project.collaborators || [];
  const previous = originalCollaborators || [];

  const added = current.filter((c) => !previous.includes(c));
  const removed = previous.filter((c) => !current.includes(c));

  try {
    const promises = [];

    if (added.length > 0) {
      promises.push(
        project.db
          .model("User")
          .updateMany(
            { email: { $in: added } },
            { $addToSet: { contributions: project._id } },
          ),
      );
    }

    if (removed.length > 0) {
      promises.push(
        project.db
          .model("User")
          .updateMany(
            { email: { $in: removed } },
            { $pull: { contributions: project._id } },
          ),
      );
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("Error syncing collaborators:", error);
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
    console.error("Error cleaning up project references:", error);
  }
});

export const Project = model("Project", projectSchema);
