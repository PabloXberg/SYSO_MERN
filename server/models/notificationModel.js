import mongoose from "mongoose";

/**
 * Notification schema.
 *
 * Types:
 *   - "like"           someone liked your sketch
 *   - "comment"        someone commented on your sketch
 *   - "comment_reply"  someone commented on a sketch you also commented on
 *   - "welcome"        first-time greeting after registration
 *
 * `actor` is who triggered the notification (the liker, commenter…).
 * For "welcome" notifications, `actor` is null.
 *
 * `sketch` links the notification to a specific sketch so clicking
 * navigates the user there. Null for "welcome".
 */
const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    type: {
      type: String,
      enum: ["like", "comment", "comment_reply", "welcome"],
      required: true,
    },
    sketch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sketche",
      default: null,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for the most common queries:
// - list notifications for a user, newest first
// - count unread for a user (badge counter)
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, read: 1 });

const NotificationModel = mongoose.model("notification", NotificationSchema);

export default NotificationModel;
