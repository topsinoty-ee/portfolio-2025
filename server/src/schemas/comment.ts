import { model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Comment = model("Comment", commentSchema);
