import mongoose from "mongoose";

// Tag categories. Two renamed in this revision:
//   "bombing"   → "vertical"
//   "character" → "ilustracion"
const ALLOWED_TAGS = [
  "sketch",
  "stencil",
  "graffiti",
  "tag",
  "vertical",
  "wildstyle",
  "throw-up",
  "trains",
  "ilustracion",
];

/**
 * Sketch model.
 *
 * NOTE on the removed `battle: String` field:
 * Earlier versions stored battle participation as a free-text number string
 * ("1", "2", ...). It's been fully replaced by `battleId` (proper ObjectId
 * relation). Old documents may still have a `battle` field in the DB —
 * Mongoose's `strict: true` (default) silently ignores it on read/write,
 * but to physically clean it up run:
 *
 *   db.sketches.updateMany({}, { $unset: { battle: "" } })
 *
 * (See INSTRUCCIONES.txt in this drop.)
 */
const sketchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    comment: { type: String, required: true },

    // Proper relation to a Battle document. Null = not participating.
    battleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "battle",
      default: null,
      index: true,
    },

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

sketchSchema.index({ owner: 1 });
sketchSchema.index({ createdAt: -1 });
sketchSchema.index({ tags: 1 });

const SketchModel = mongoose.model("sketche", sketchSchema);

export default SketchModel;
export { ALLOWED_TAGS };
