import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    sketch: { type: mongoose.Schema.Types.ObjectId, ref: "sketche" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

// PERF: Indexes for cleanup operations (deleteMany by sketch/owner)
// and for populating comments in chronological order.
CommentSchema.index({ sketch: 1 });
CommentSchema.index({ owner: 1 });
CommentSchema.index({ createdAt: -1 });

const CommentModel = mongoose.model("comment", CommentSchema);

export default CommentModel;
