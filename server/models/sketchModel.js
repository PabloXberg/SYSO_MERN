import mongoose from 'mongoose';

const sketchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  url: { type: String, default: "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921923/user_sketches/Default_Image_Thumbnail_tk7kkh.png" }
}, { timestamps: true });

const SketchModel = mongoose.model("sketche", sketchSchema);

export default SketchModel