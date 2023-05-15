import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  likes: [{ type: String }],
  sketchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref:"user" }
}, { timestamps: true });

const CommentModel = mongoose.model("comment", commentSchema);

export default CommentModel