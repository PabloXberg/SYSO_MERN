import mongoose from 'mongoose';

const sketchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref:"user" }
}, { timestamps: true });

const SketchModel = mongoose.model("sketche", sketchSchema);

export default SketchModel