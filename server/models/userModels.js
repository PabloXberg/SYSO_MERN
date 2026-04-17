import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, trim: true },
    password: { type: String, required: true },
    info: String,
    sketchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dhaezmblt/image/upload/v1716493293/avatar-3814049_640_ykc5lj.png",
    },

    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// PERF: Indexes speed up common queries.
// - email: already has unique index from `unique: true` above
// - createdAt: used for sorting users newest-first in paginated responses
// - resetPasswordToken: used in the reset-password lookup (+ expiry check)
userSchema.index({ createdAt: -1 });
userSchema.index({ resetPasswordToken: 1 });

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
