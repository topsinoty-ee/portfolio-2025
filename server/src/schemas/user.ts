import { model, Schema } from "mongoose";

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
    avatar: { type: String }, // URL to avatar
    githubId: { type: String, unique: true, sparse: true }, // Only for GitHub-connected users
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ githubId: 1 }, { unique: true });

export const User = model("User", userSchema);
