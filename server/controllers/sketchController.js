import SketchModel from "../models/sketchModel.js";
import UserModel from "../models/userModels.js";
import CommentModel from "../models/commentModel.js";
import imageUpload from "../utils/imageManagement.js";

// ==============================================================
// READ
// ==============================================================
const getAllSketches = async (req, res) => {
  try {
    // PERF: Paginated to avoid loading hundreds of sketches at once.
    // Frontend can pass ?page=1&limit=20. Defaults return the 20 most recent.
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [sketches, total] = await Promise.all([
      SketchModel.find()
        .sort({ createdAt: -1 }) // newest first (replaces frontend `.reverse()`)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "owner",
          select: ["email", "username", "avatar", "likes", "sketchs", "createdAt", "info"],
        })
        .populate("comments"),
      SketchModel.countDocuments(),
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

const getSketchbyID = async (req, res) => {
  try {
    const sketch = await SketchModel.findById(req.params.id)
      .populate({
        path: "owner",
        select: ["email", "username", "avatar", "likes", "sketchs", "createdAt", "info"],
      })
      .populate({
        path: "likes",
        populate: [{ path: "owner", select: ["username"] }],
      })
      .populate({
        path: "comments",
        populate: [{ path: "owner", select: ["username"] }],
      });

    if (!sketch) return res.status(404).json({ error: "Sketch no encontrado" });
    res.status(200).json(sketch);
  } catch (error) {
    console.error("getSketchbyID error:", error);
    res.status(500).json({ error: "Something went wrong..." });
  }
};

// ==============================================================
// CREATE
// ==============================================================
const addSketchToUser = async (userId, sketchId) => {
  await UserModel.findByIdAndUpdate(
    userId,
    { $push: { sketchs: sketchId } },
    { new: true }
  );
};

const createSketch = async (req, res) => {
  if (!req.body.name || !req.body.comment) {
    return res.status(400).json({ error: "Nombre y descripción son obligatorios" });
  }

  try {
    const url = await imageUpload(req.file, "user_sketches");

    const newSketch = new SketchModel({
      name: req.body.name,
      comment: req.body.comment,
      url,
      // SECURITY: use the authenticated user, not something from the body.
      // Otherwise a logged-in user could create sketches "owned by" anyone.
      owner: req.user._id,
      battle: req.body.battle || "",
    });

    const sketchToSave = await newSketch.save();
    await addSketchToUser(req.user._id, sketchToSave._id);

    res.status(200).json({
      message: "Sketch subido exitosamente",
      newSketch: sketchToSave,
    });
  } catch (error) {
    console.error("createSketch error:", error);
    res.status(500).json({ error: "Algo no quedó bien..." });
  }
};

// ==============================================================
// UPDATE
// ==============================================================
const updateSketch = async (req, res) => {
  // Accept the id from URL param or body (both in case the frontend changes)
  const sketchId = req.params.id || req.body._id;

  try {
    const sketch = await SketchModel.findById(sketchId);
    if (!sketch) return res.status(404).json({ error: "Sketch no encontrado" });

    // SECURITY: verify the logged-in user owns this sketch.
    // Previously ANY logged-in user could edit ANY sketch.
    if (sketch.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No tienes permiso para editar este boceto" });
    }

    const infoToUpdate = {};
    if (req.body.name) infoToUpdate.name = req.body.name;
    if (req.body.comment) infoToUpdate.comment = req.body.comment;
    // BUG FIX: previous line was `infoToUpdate.comment = req.body.battle`
    // which OVERWROTE the sketch comment with the battle number.
    if (req.body.battle) infoToUpdate.battle = req.body.battle;

    if (req.file) {
      const url = await imageUpload(req.file, "user_sketches");
      infoToUpdate.url = url;
    }

    const updatedSketch = await SketchModel.findByIdAndUpdate(
      sketchId,
      infoToUpdate,
      { new: true }
    );
    res.status(200).json(updatedSketch);
  } catch (error) {
    console.error("updateSketch error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================================
// DELETE  (with proper cleanup)
// ==============================================================
const deleteSketch = async (req, res) => {
  const sketchId = req.params.id || req.body._id;

  try {
    const sketch = await SketchModel.findById(sketchId);
    if (!sketch) return res.status(404).json({ error: "Sketch no encontrado" });

    // SECURITY: ownership check
    if (sketch.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No tienes permiso para borrar este boceto" });
    }

    // 1. Delete all comments on this sketch
    await CommentModel.deleteMany({ sketch: sketchId });

    // 2. Remove this sketch from ALL users' likes arrays
    await UserModel.updateMany(
      { likes: sketchId },
      { $pull: { likes: sketchId } }
    );

    // 3. Remove from owner's sketchs array
    await UserModel.findByIdAndUpdate(
      sketch.owner,
      { $pull: { sketchs: sketchId } }
    );

    // 4. Finally delete the sketch
    await SketchModel.findByIdAndDelete(sketchId);

    res.status(200).json({ message: "Sketch borrado correctamente" });
  } catch (error) {
    console.error("deleteSketch error:", error);
    res.status(500).json({ error: "No se puede borrar el sketch" });
  }
};

// ==============================================================
// LIKES
// ==============================================================
const addLike = async (req, res) => {
  try {
    const sketchId = req.body.sketch;

    // Prevent duplicate likes by the same user
    await SketchModel.findByIdAndUpdate(
      sketchId,
      { $addToSet: { likes: req.user._id } }, // $addToSet = push only if not present
      { new: true }
    );

    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { likes: sketchId } },
      { new: true }
    );

    res.status(200).json({ message: "Success! liked" });
  } catch (error) {
    console.error("addLike error:", error);
    res.status(500).json({ error: "Algo salió mal... " + error.message });
  }
};

const deleteLike = async (req, res) => {
  try {
    const sketchId = req.body.sketch;

    await SketchModel.findByIdAndUpdate(
      sketchId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { likes: sketchId } },
      { new: true }
    );

    res.status(200).json({ message: "Success! unliked" });
  } catch (error) {
    console.error("deleteLike error:", error);
    res.status(500).json({ error: "Algo salió mal... " + error.message });
  }
};

export {
  getAllSketches,
  createSketch,
  addLike,
  deleteLike,
  getSketchbyID,
  deleteSketch,
  updateSketch,
};
