import SketchModel from "../models/sketchModel.js";
import UserModel from "../models/userModels.js";
import CommentModel from "../models/commentModel.js";
import imageUpload from "../utils/imageManagement.js";

// ==============================================================
// Helper: parse tags from a request body that may send them as
// either an array (JSON) or a comma-separated string (form-data).
// Silently drops any invalid entries and caps at 3.
// ==============================================================
const ALLOWED_TAGS = [
  "sketch", "stencil", "graffiti", "tag", "bombing",
  "wildstyle", "throw-up", "blockbuster", "character",
];

const parseTags = (raw) => {
  if (!raw) return [];
  let arr = Array.isArray(raw) ? raw : String(raw).split(",");
  return arr
    .map((t) => String(t).trim().toLowerCase())
    .filter((t) => ALLOWED_TAGS.includes(t))
    .slice(0, 3);
};

// ==============================================================
// GET /sketches/all — paginated + search + tag filter
// ==============================================================
const getAllSketches = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const tag = (req.query.tag || "").trim().toLowerCase();

    let filter = {};

    // Text search across name, comment, and owner username
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      const matchingUsers = await UserModel.find({ username: regex }, "_id");
      const userIds = matchingUsers.map((u) => u._id);

      filter = {
        $or: [
          { name: regex },
          { comment: regex },
          { owner: { $in: userIds } },
        ],
      };
    }

    // Tag filter (combines with search via $and if both present)
    if (tag && ALLOWED_TAGS.includes(tag)) {
      filter = search ? { $and: [filter, { tags: tag }] } : { tags: tag };
    }

    const [sketches, total] = await Promise.all([
      SketchModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "owner",
          select: ["email", "username", "avatar", "likes", "sketchs", "createdAt", "info"],
        })
        .populate("comments"),
      SketchModel.countDocuments(filter),
    ]);

    res.status(200).json({
      sketches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + sketches.length < total,
      },
    });
  } catch (error) {
    console.error("getAllSketches error:", error);
    res.status(500).json({ error: "Algo salió mal..." });
  }
};

// ==============================================================
// GET /sketches/id/:id
// ==============================================================
const getSketchbyID = async (req, res) => {
  try {
    const sketch = await SketchModel.findById(req.params.id)
      .populate({
        path: "owner",
        select: ["email", "username", "avatar", "likes", "sketchs", "createdAt", "info"],
      })
      .populate({
        path: "likes",
        select: "username avatar",
      })
      .populate({
        path: "comments",
        populate: [{ path: "owner", select: ["username"] }],
      })
      .lean();

    if (!sketch) return res.status(404).json({ error: "Sketch no encontrado" });

    // Defensive: filter orphaned comments/likes
    if (sketch.comments) sketch.comments = sketch.comments.filter((c) => c && c.owner);
    if (sketch.likes) sketch.likes = sketch.likes.filter((l) => l);

    res.status(200).json(sketch);
  } catch (error) {
    console.error("getSketchbyID error:", error);
    res.status(500).json({ error: "Something went wrong..." });
  }
};

// ==============================================================
// POST /sketches/new
// ==============================================================
const createSketch = async (req, res) => {
  try {
    const url = await imageUpload(req.file, "user_sketches");
    const tags = parseTags(req.body.tags);

    const newSketch = await SketchModel.create({
      name: req.body.name,
      comment: req.body.comment,
      battle: req.body.battle || "",
      owner: req.user._id,
      url,
      tags,
    });

    await UserModel.findByIdAndUpdate(req.user._id, {
      $push: { sketchs: newSketch._id },
    });

    res.status(201).json(newSketch);
  } catch (error) {
    console.error("createSketch error:", error);
    res.status(500).json({ error: "Algo salió mal al crear el boceto" });
  }
};

// ==============================================================
// POST /sketches/update/:id (ownership checked)
// ==============================================================
const updateSketch = async (req, res) => {
  try {
    const sketch = await SketchModel.findById(req.params.id);
    if (!sketch) return res.status(404).json({ error: "Sketch no encontrado" });
    if (sketch.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const infoToUpdate = {};
    if (req.body.name) infoToUpdate.name = req.body.name;
    if (req.body.comment) infoToUpdate.comment = req.body.comment;
    if (req.body.battle !== undefined) infoToUpdate.battle = req.body.battle;
    if (req.body.tags !== undefined) infoToUpdate.tags = parseTags(req.body.tags);
    if (req.file) infoToUpdate.url = await imageUpload(req.file, "user_sketches");

    const updated = await SketchModel.findByIdAndUpdate(
      req.params.id,
      infoToUpdate,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("updateSketch error:", error);
    res.status(500).json({ error: "Algo salió mal al actualizar el boceto" });
  }
};

// ==============================================================
// DELETE /sketches/delete/:id (ownership checked)
// ==============================================================
const deleteSketch = async (req, res) => {
  try {
    const sketch = await SketchModel.findById(req.params.id);
    if (!sketch) return res.status(404).json({ error: "Sketch no encontrado" });
    if (sketch.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // Cleanup: comments, likes, and user reference
    await CommentModel.deleteMany({ sketch: req.params.id });
    await UserModel.updateMany(
      { likes: req.params.id },
      { $pull: { likes: req.params.id } }
    );
    await UserModel.findByIdAndUpdate(sketch.owner, {
      $pull: { sketchs: req.params.id },
    });
    await SketchModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Sketch eliminado" });
  } catch (error) {
    console.error("deleteSketch error:", error);
    res.status(500).json({ error: "Algo salió mal al eliminar el boceto" });
  }
};

// ==============================================================
// POST /sketches/like
// ==============================================================
const addLike = async (req, res) => {
  try {
    const { sketch } = req.body;
    await SketchModel.findByIdAndUpdate(sketch, {
      $addToSet: { likes: req.user._id },
    });
    await UserModel.findByIdAndUpdate(req.user._id, {
      $addToSet: { likes: sketch },
    });
    res.status(200).json({ msg: "Like agregado" });
  } catch (error) {
    console.error("addLike error:", error);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

// ==============================================================
// POST /sketches/unlike
// ==============================================================
const deleteLike = async (req, res) => {
  try {
    const { sketch } = req.body;
    await SketchModel.findByIdAndUpdate(sketch, {
      $pull: { likes: req.user._id },
    });
    await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { likes: sketch },
    });
    res.status(200).json({ msg: "Like removido" });
  } catch (error) {
    console.error("deleteLike error:", error);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

export {
  getAllSketches,
  getSketchbyID,
  createSketch,
  updateSketch,
  deleteSketch,
  addLike,
  deleteLike,
};
