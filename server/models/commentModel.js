import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  // likes:[{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  sketch: { type: mongoose.Schema.Types.ObjectId, ref: "sketche" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref:"user" }
}, { timestamps: true });

const CommentModel = mongoose.model("comment", CommentSchema);

export default CommentModel