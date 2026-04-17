import CommentModel from "../models/commentModel.js";
import SketchModel from "../models/sketchModel.js";
import UserModel from "../models/userModels.js";

// ==============================================================
// HELPERS — keep user.comments and sketch.comments in sync
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
// CREATE
// ==============================================================
const createComment = async (req, res) => {
  if (!req.body.comment || !req.body.sketch) {
    return res.status(406).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const newComment = new CommentModel({
      comment: req.body.comment,
      // SECURITY: owner comes from the authenticated user, not the body
      owner: req.user._id,
      sketch: req.body.sketch,
    });

    const savedComment = await newComment.save();
    await addCommentToUser(req.user._id, savedComment._id);
    await addCommentToSketch(req.body.sketch, savedComment._id);

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

    // SECURITY: only the author can edit their comment
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

    // SECURITY: only the author can delete their comment
    if (comment.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para borrar este comentario" });
    }

    // BUG FIX: `findByIdAndRemove` was deprecated in Mongoose 7+ — use `findByIdAndDelete`
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
