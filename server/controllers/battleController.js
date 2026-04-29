import BattleModel from "../models/battleModel.js";
import SketchModel from "../models/sketchModel.js";
import { createNotification } from "./notificationController.js";

// ============================================================
// HELPERS
// ============================================================

/**
 * Notify all unique participants of a battle.
 * "Unique" = one notification per user, even if they have multiple sketches in
 * the battle. Useful to avoid spamming the bell icon.
 *
 * @param {ObjectId} battleId
 * @param {string}   type           One of the battle_* notification types
 * @param {Set<string>} excludeIds  User IDs to skip (e.g. the popular winner,
 *                                  who gets a different notification)
 */
const notifyBattleParticipants = async (battleId, type, excludeIds = new Set()) => {
  try {
    const sketches = await SketchModel.find({ battleId }).select("_id owner").lean();
    const seenOwners = new Set();
    for (const s of sketches) {
      if (!s.owner) continue;
      const ownerStr = s.owner.toString();
      if (seenOwners.has(ownerStr)) continue;       // dedupe per user
      if (excludeIds.has(ownerStr)) continue;       // skip excluded users
      seenOwners.add(ownerStr);
      await createNotification({
        recipient: s.owner,
        actor: null,
        type,
        sketch: s._id,
        battle: battleId,
      });
    }
  } catch (err) {
    console.error("notifyBattleParticipants error:", err);
  }
};

/**
 * Notify a single sketch owner that they won (popular or jury).
 */
const notifyWinner = async (sketchId, battleId, type) => {
  try {
    const sketch = await SketchModel.findById(sketchId).select("_id owner").lean();
    if (!sketch || !sketch.owner) return;
    await createNotification({
      recipient: sketch.owner,
      actor: null,
      type,
      sketch: sketch._id,
      battle: battleId,
    });
  } catch (err) {
    console.error("notifyWinner error:", err);
  }
};

// ============================================================
// READ ENDPOINTS
// ============================================================

const getAllBattles = async (req, res) => {
  try {
    const battles = await BattleModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "popularWinners juryWinners",
        select: "name url owner likes",
        populate: { path: "owner", select: "username avatar" },
      });
    res.status(200).json(battles);
  } catch (err) {
    console.error("getAllBattles error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

const getCurrentBattle = async (req, res) => {
  try {
    const battle = await BattleModel.findOne({ isCurrent: true })
      .populate({
        path: "popularWinners juryWinners",
        select: "name url owner likes",
        populate: { path: "owner", select: "username avatar" },
      })
      .lean();
    res.status(200).json(battle || null);
  } catch (err) {
    console.error("getCurrentBattle error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

const getBattleById = async (req, res) => {
  try {
    const battle = await BattleModel.findById(req.params.id)
      .populate({
        path: "popularWinners juryWinners",
        select: "name url owner likes",
        populate: { path: "owner", select: "username avatar" },
      })
      .lean();
    if (!battle) return res.status(404).json({ error: "Batalla no encontrada" });

    const sketches = await SketchModel.find({ battleId: battle._id })
      .populate("owner", "username avatar")
      .lean();
    sketches.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    res.status(200).json({ battle, sketches });
  } catch (err) {
    console.error("getBattleById error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

// ============================================================
// WRITE ENDPOINTS (admin only — guarded by adminAuth middleware)
// ============================================================

const createBattle = async (req, res) => {
  try {
    const {
      theme, description, submissionDeadline, votingDeadline,
      prizes, judges, isCurrent,
    } = req.body;

    if (!theme || !submissionDeadline || !votingDeadline) {
      return res.status(400).json({
        error: "Faltan campos: theme, submissionDeadline, votingDeadline",
      });
    }

    if (isCurrent) {
      await BattleModel.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
    }

    const battle = await BattleModel.create({
      theme,
      description: description || "",
      submissionDeadline,
      votingDeadline,
      prizes: prizes || "",
      judges: judges || "",
      isCurrent: !!isCurrent,
      state: "open",
    });

    res.status(201).json(battle);
  } catch (err) {
    console.error("createBattle error:", err);
    res.status(500).json({ error: "Algo salió mal al crear la batalla" });
  }
};

/**
 * PUT /api/battles/:id
 *
 * Special handling: if `juryWinners` is provided and contains NEW sketch IDs
 * (compared to what's currently saved), we send a "battle_winner_jury"
 * notification to each new jury winner. This way admins can announce winners
 * over time without retriggering notifications for previously-announced ones.
 */
const updateBattle = async (req, res) => {
  try {
    const allowed = [
      "theme", "description", "submissionDeadline", "votingDeadline",
      "prizes", "judges", "isCurrent", "state",
      "popularWinners", "juryWinners",
    ];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    if (update.isCurrent === true) {
      await BattleModel.updateMany(
        { _id: { $ne: req.params.id }, isCurrent: true },
        { $set: { isCurrent: false } }
      );
    }

    // Snapshot before-state to diff jury winners later
    const before = await BattleModel.findById(req.params.id).lean();
    if (!before) return res.status(404).json({ error: "Batalla no encontrada" });

    const battle = await BattleModel.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    // Detect newly-added jury winners and notify them
    if (update.juryWinners !== undefined) {
      const beforeJury = (before.juryWinners || []).map((id) => id.toString());
      const afterJury = (battle.juryWinners || []).map((id) => id.toString());
      const newWinners = afterJury.filter((id) => !beforeJury.includes(id));
      for (const sketchId of newWinners) {
        await notifyWinner(sketchId, battle._id, "battle_winner_jury");
      }
    }

    res.status(200).json(battle);
  } catch (err) {
    console.error("updateBattle error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

const deleteBattle = async (req, res) => {
  try {
    const battle = await BattleModel.findByIdAndDelete(req.params.id);
    if (!battle) return res.status(404).json({ error: "Batalla no encontrada" });
    res.status(200).json({ msg: "Batalla eliminada" });
  } catch (err) {
    console.error("deleteBattle error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

// ============================================================
// STATE MACHINE
// ============================================================

/**
 * Calculate the popular winner for a battle (most likes; ties broken by
 * createdAt desc — slight bias toward later submissions, but deterministic).
 */
const calculatePopularWinner = async (battleId) => {
  const sketches = await SketchModel.find({ battleId })
    .select("_id likes createdAt")
    .lean();
  if (sketches.length === 0) return null;
  sketches.sort((a, b) => {
    const diff = (b.likes?.length || 0) - (a.likes?.length || 0);
    if (diff !== 0) return diff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  return sketches[0]._id;
};

const triggerStateTransitions = async (req, res) => {
  try {
    const result = await runStateTransitions();
    res.status(200).json(result);
  } catch (err) {
    console.error("triggerStateTransitions error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

/**
 * Core state machine.
 *
 * Notifications are sent ONLY on the actual transition (not on every check),
 * so this is safe to run on a 10-minute interval indefinitely. Idempotent:
 * a battle already in "voting" doesn't trigger another notification because
 * the find query only matches battles still in "open".
 *
 *   open + submissionDeadline passed → voting
 *     ↳ notify all participants ("battle_voting")
 *
 *   voting + votingDeadline passed → finished
 *     ↳ auto-pick popular winner if not already set
 *     ↳ notify popular winner ("battle_winner_popular")
 *     ↳ notify everyone else ("battle_finished")
 */
const runStateTransitions = async () => {
  const now = new Date();
  let opened = 0;
  let closed = 0;

  // open → voting
  const toVote = await BattleModel.find({
    state: "open",
    submissionDeadline: { $lte: now },
  });
  for (const b of toVote) {
    b.state = "voting";
    await b.save();
    await notifyBattleParticipants(b._id, "battle_voting");
    opened++;
  }

  // voting → finished
  const toClose = await BattleModel.find({
    state: "voting",
    votingDeadline: { $lte: now },
  });
  for (const b of toClose) {
    b.state = "finished";

    // Calculate popular winner if not already manually set
    let popularWinnerId = b.popularWinners?.[0]?.toString() || null;
    if (!popularWinnerId) {
      const calculated = await calculatePopularWinner(b._id);
      if (calculated) {
        b.popularWinners = [calculated];
        popularWinnerId = calculated.toString();
      }
    }
    await b.save();

    // Notify the popular winner specifically
    if (popularWinnerId) {
      await notifyWinner(popularWinnerId, b._id, "battle_winner_popular");
    }

    // Notify everyone else (exclude the popular winner)
    const exclude = new Set();
    if (popularWinnerId) {
      const winnerSketch = await SketchModel.findById(popularWinnerId)
        .select("owner").lean();
      if (winnerSketch?.owner) exclude.add(winnerSketch.owner.toString());
    }
    await notifyBattleParticipants(b._id, "battle_finished", exclude);

    closed++;
  }

  if (opened || closed) {
    console.log(`⚔️  Battle transitions: ${opened} → voting, ${closed} → finished`);
  }
  return { opened, closed, ranAt: now };
};

export {
  getAllBattles,
  getCurrentBattle,
  getBattleById,
  createBattle,
  updateBattle,
  deleteBattle,
  triggerStateTransitions,
  runStateTransitions,
  calculatePopularWinner,
};
