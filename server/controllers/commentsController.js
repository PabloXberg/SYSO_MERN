import CommentModel from "../models/commentModel.js";
import SketchModel from "../models/sketchModel.js";
import UserModel from "../models/userModels.js";
import {
  createNotification,
  notifyCommentReplies,
} from "./notificationController.js";

// ==============================================================
// HELPERS
// ==============================================================
const addCommentToUser = (userId, commentId) =>
  UserModel.findByIdAndUpdate(userId, { $push: { comments: commentId } });

const removeCommentFromUser = (userId, commentId) =>
  UserModel.findByIdAndUpdate(userId, { $pull: { comments: commentId } });

const addCommentToSketch = (sketchId, commentId) =>
  SketchModel.findByIdAndUpdate(sketchId, { $push: { comments: commentId } });

const removeCommentFromSketch = (sketchId, commentId) =>
  SketchModel.findByIdAndUpdate(sketchId, { $pull: { comments: commentId } });

// ==============================================================
// CREATE — also fires notifications
// ==============================================================
const createComment = async (req, res) => {
  if (!req.body.comment || !req.body.sketch) {
    return res.status(406).json({ error: "Faltan campos obligatorios" });
  }

  try {
    // Look up the sketch FIRST so we know who owns it (for the notification)
    // and so we detect existing commenters before adding the new one.
    const sketch = await SketchModel.findById(req.body.sketch).select("owner");
    if (!sketch) {
      return res.status(404).json({ error: "Sketch no encontrado" });
    }

    const newComment = new CommentModel({
      comment: req.body.comment,
      // SECURITY: owner comes from the authenticated user, not the body
      owner: req.user._id,
      sketch: req.body.sketch,
    });

    const savedComment = await newComment.save();
    await addCommentToUser(req.user._id, savedComment._id);
    await addCommentToSketch(req.body.sketch, savedComment._id);

    // ───── Notifications ─────────────────────────────────────────
    // 1) Notify the sketch owner — gets a "comment" notification
    await createNotification({
      recipient: sketch.owner,
      actor: req.user._id,
      type: "comment",
      sketch: req.body.sketch,
    });

    // 2) Notify other previous commenters with "comment_reply".
    //    The helper excludes the actor and the owner so nobody gets a
    //    duplicate notification.
    await notifyCommentReplies(req.body.sketch, req.user._id, sketch.owner);

    res.status(200).json({
      message: "Mensaje guardado!",
      newComment: savedComment,
    });
  } catch (error) {
    console.error("createComment error:", error);
    res.status(500).json({ error: "No se puede guardar el mensaje" });
  }
};

// ==============================================================
// UPDATE
// ==============================================================
const updatecomment = async (req, res) => {
  const commentId = req.params.id || req.body._id;

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comentario no encontrado" });

    if (comment.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para editar este comentario" });
    }

    if (!req.body.comment) {
      return res.status(400).json({ error: "Texto del comentario requerido" });
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { comment: req.body.comment },
      { new: true }
    );

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("updatecomment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================================
// DELETE
// ==============================================================
const deleteComment = async (req, res) => {
  const commentId = req.params.id || req.body._id;

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comentario no encontrado" });

    if (comment.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para borrar este comentario" });
    }

    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    await removeCommentFromUser(comment.owner, commentId);
    await removeCommentFromSketch(comment.sketch, commentId);

    res.status(200).json({
      message: "Mensaje borrado!",
      deletedComment,
    });
  } catch (error) {
    console.error("deleteComment error:", error);
    res.status(500).json({ error: "No se puede borrar el mensaje" });
  }
};

export { createComment, updatecomment, deleteComment };
