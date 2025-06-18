import {searchGithubUsers} from "@/utils/searchGithubUsers";
import secret from "@/config";
import {ClientSession, model, Schema, Types} from "mongoose";

// TODO: Add email validation
// TODO: Add OTP
// TODO: Add better error handling

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /.+@.+\..+/.test(v),
        message: "Invalid email format",
      },
    },
    avatar: {type: String},
    githubId: {type: String, unique: true, sparse: true},
    isVerified: {type: Boolean, default: false},
    contributions: {
      type: [{type: Types.ObjectId, ref: "Project"}],
      default: [],
    },
    isAdmin: {type: Boolean, default: false},
  },
  {timestamps: true, minimize: true}
);

userSchema.index({contributions: 1});

let originalEmail: string = "";

userSchema.pre("save", function () {
  if (!this.isNew) {
    originalEmail = this.email;
  }
});

userSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  
  if (this.email.trim() === "oluwatobilobasi05@gmail.com") {
    this.isAdmin = true;
    this.isVerified = true;
  }
  
  next();
});

userSchema.post("save", async function (user) {
  if (user.isNew) {
    try {
      const [githubUser, matchingProjects] = await Promise.all([
        searchGithubUsers(user.email, secret.gitPersonalAccessToken).catch(
          () => null
        ),
        user.db.models.Project.find({
            collaborators: user.email,
            isArchived: {$ne: true},
          })
          .select("_id")
          .catch(() => []),
      ]);
      
      const updateData: any = {};
      
      if (githubUser) {
        updateData.githubId = String(githubUser.id);
        if (githubUser.avatar_url?.trim()) {
          updateData.avatar = githubUser.avatar_url.trim();
        }
      }
      
      if (matchingProjects.length) {
        updateData.$addToSet = {
          contributions: {$each: matchingProjects.map((p: any) => p._id)},
        };
      }
      
      if (Object.keys(updateData).length > 0) {
        await user.updateOne(updateData);
      }
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Error in post-save user sync: " + error);
    }
  } else if (user.isModified("email")) {
    try {
      await user.db
        .model("Project")
        .updateMany(
          {collaborators: originalEmail},
          {$set: {"collaborators.$": user.email}}
        );
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Error updating email in projects: " + error);
    }
  }
});

userSchema.pre("deleteOne", {document: true}, async function () {
  try {
    await this.db
      .model("Project")
      .updateMany(
        {collaborators: this.email},
        {$pull: {collaborators: this.email}}
      );
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Error cleaning up user references: " + error);
  }
});

userSchema.statics.syncContributions = async function (
  userId: Types.ObjectId,
  session?: ClientSession
) {
  const user = await this.findById(userId).session(session || null);
  if (!user) throw new Error("User not found");
  
  const projects = await this.db.models.Project.find({
      collaborators: user.email,
      isArchived: {$ne: true},
    })
    .select("_id")
    .session(session || null);
  
  if (projects.length) {
    await user.updateOne(
      {
        $addToSet: {
          contributions: {$each: projects.map((project) => project._id)},
        },
      },
      {session: session || null}
    );
  }
  
  return user;
};

export const User = model("User", userSchema);
