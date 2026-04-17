import mongoose from "mongoose";

const sketchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    battle: { type: String, required: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921923/user_sketches/Default_Image_Thumbnail_tk7kkh.png",
    },
  },
  { timestamps: true }
);

// PERF: Indexes for common lookups.
// - owner: used when fetching a user's sketches
// - createdAt: used for paginated chronological listings
// - battle: used for filtering sketches by battle number
sketchSchema.index({ owner: 1 });
sketchSchema.index({ createdAt: -1 });
sketchSchema.index({ battle: 1 });

const SketchModel = mongoose.model("sketche", sketchSchema);

export default SketchModel;
