import BattleModel from "../models/battleModel.js";
import SketchModel from "../models/sketchModel.js";

/**
 * GET /api/battles — list all battles, newest first
 */
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

/**
 * GET /api/battles/current — the one battle marked isCurrent: true
 * Returns null (200) if no current battle exists, so frontend handles gracefully.
 */
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

/**
 * GET /api/battles/:id — a specific battle plus its participating sketches
 * (sorted by likes desc, so the gallery is "leaderboard-style" out of the box).
 */
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

    // Sort by likes count desc (Mongo can't sort by array length cheaply without aggregation)
    sketches.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    res.status(200).json({ battle, sketches });
  } catch (err) {
    console.error("getBattleById error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

/**
 * POST /api/battles — create a new battle (admin only).
 * If isCurrent: true, automatically un-currents any other battle so there's
 * never two current battles at once.
 */
const createBattle = async (req, res) => {
  try {
    const {
      theme,
      description,
      submissionDeadline,
      votingDeadline,
      prizes,
      judges,
      isCurrent,
    } = req.body;

    if (!theme || !submissionDeadline || !votingDeadline) {
      return res
        .status(400)
        .json({ error: "Faltan campos: theme, submissionDeadline, votingDeadline" });
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
 * PUT /api/battles/:id — edit any field (admin only).
 * Special handling: if isCurrent is set to true, un-current others.
 * Special handling: if state is set, just trust the admin (manual override).
 */
const updateBattle = async (req, res) => {
  try {
    const allowed = [
      "theme",
      "description",
      "submissionDeadline",
      "votingDeadline",
      "prizes",
      "judges",
      "isCurrent",
      "state",
      "popularWinners",
      "juryWinners",
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

    const battle = await BattleModel.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!battle) return res.status(404).json({ error: "Batalla no encontrada" });

    res.status(200).json(battle);
  } catch (err) {
    console.error("updateBattle error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

/**
 * DELETE /api/battles/:id — admin only.
 * Sketches that participated keep their reference (battleId); we don't null them
 * to preserve historical context.
 */
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

/**
 * Calculate the popular winner for a battle: sketch with the most likes among
 * those participating. Used both by automatic state transitions and by admin
 * "recalculate" action.
 *
 * In case of a tie, the most recently created sketch wins (slight bias toward
 * later submissions, but consistent and non-arbitrary).
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

/**
 * POST /api/battles/run-transitions — admin trigger.
 * Same logic as the automatic interval, exposed as an endpoint so admins can
 * force a check without waiting for the timer.
 */
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
 * Core state machine. Runs on an interval (see index.js) AND can be triggered
 * manually. Idempotent: safe to run repeatedly.
 *
 *   open + submissionDeadline passed       → voting
 *   voting + votingDeadline passed          → finished + auto-fill popularWinner
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
    opened++;
  }

  // voting → finished (and auto-pick popular winner)
  const toClose = await BattleModel.find({
    state: "voting",
    votingDeadline: { $lte: now },
  });
  for (const b of toClose) {
    b.state = "finished";
    if (!b.popularWinners || b.popularWinners.length === 0) {
      const winnerId = await calculatePopularWinner(b._id);
      if (winnerId) b.popularWinners = [winnerId];
    }
    await b.save();
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
