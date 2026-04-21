import mongoose from "mongoose";

// Allowed tags — must match the frontend TAG_OPTIONS constant exactly.
// Keep in sync with: client/src/constants/tags.ts
const ALLOWED_TAGS = [
  "sketch",
  "stencil",
  "graffiti",
  "tag",
  "bombing",
  "wildstyle",
  "throw-up",
  "blockbuster",
  "character",
];

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
    tags: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (arr) => arr.length <= 3,
          message: "A sketch can have at most 3 tags",
        },
        {
          validator: (arr) => arr.every((t) => ALLOWED_TAGS.includes(t)),
          message: "Invalid tag",
        },
      ],
    },
  },
  { timestamps: true }
);

// Indexes for common lookups
sketchSchema.index({ owner: 1 });
sketchSchema.index({ createdAt: -1 });
sketchSchema.index({ battle: 1 });
sketchSchema.index({ tags: 1 });

const SketchModel = mongoose.model("sketche", sketchSchema);

export default SketchModel;
export { ALLOWED_TAGS };
