import mongoose from "mongoose";

/**
 * Battle: a single sketch competition.
 *
 * Lifecycle:
 *   open      → sketches can be submitted (battleId set on sketch)
 *   voting    → submissions closed; users can still like (likes = popular vote)
 *   finished  → admin announces winners
 *
 * State transitions happen automatically by date (see battleController.runStateTransitions)
 * but can also be forced manually by an admin.
 *
 * Winners are arrays for forward-compat: today the UI shows juryWinners[0] and
 * popularWinners[0] but if you later want to highlight 3 jury picks + 1 popular,
 * you only change the frontend — schema already supports it.
 */
const battleSchema = new mongoose.Schema(
  {
    theme: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    state: {
      type: String,
      enum: ["open", "voting", "finished"],
      default: "open",
      index: true,
    },

    // Dates that drive automatic state transitions
    submissionDeadline: { type: Date, required: true },
    votingDeadline: { type: Date, required: true },

    // Free-text fields announced when the battle opens
    prizes: { type: String, default: "" },
    judges: { type: String, default: "" },

    // Only one battle has isCurrent: true at a time. Enforced in controller.
    isCurrent: { type: Boolean, default: false, index: true },

    // Winner arrays — see comment at top about flexibility
    popularWinners: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
    juryWinners: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
  },
  { timestamps: true }
);

battleSchema.index({ createdAt: -1 });

const BattleModel = mongoose.model("battle", battleSchema);

export default BattleModel;
