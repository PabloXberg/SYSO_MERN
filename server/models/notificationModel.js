import mongoose from "mongoose";

/**
 * Notification schema.
 *
 * Types:
 *   - "like"                   someone liked your sketch
 *   - "comment"                someone commented on your sketch
 *   - "comment_reply"          someone commented on a sketch you also commented on
 *   - "welcome"                first-time greeting after registration
 *   - "battle_voting"          a battle you're in just entered the voting phase
 *   - "battle_finished"        a battle you're in is over (you didn't win popular)
 *   - "battle_winner_popular"  YOU won the popular vote in a battle 🏆
 *   - "battle_winner_jury"     YOU won the jury prize in a battle 👑
 *
 * `actor` is null for system events (welcome, all battle_* types).
 * `sketch` points to the relevant sketch (the user's entry, the liked sketch…).
 * `battle` is set ONLY for battle_* types so the frontend can link to /actualbattle.
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
      enum: [
        "like",
        "comment",
        "comment_reply",
        "welcome",
        "battle_voting",
        "battle_finished",
        "battle_winner_popular",
        "battle_winner_jury",
      ],
      required: true,
    },
    sketch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sketche",
      default: null,
    },
    battle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "battle",
      default: null,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, read: 1 });

const NotificationModel = mongoose.model("notification", NotificationSchema);

export default NotificationModel;
