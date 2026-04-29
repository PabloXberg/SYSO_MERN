import NotificationModel from "../models/notificationModel.js";
import CommentModel from "../models/commentModel.js";

// ============================================================
// HELPERS — these are exported and called from other controllers
// (sketchController, commentsController, userControllers, battleController)
// ============================================================

/**
 * Create a single notification. Silently fails on error so it never
 * blocks the main action (liking, commenting, state transitioning…).
 *
 * For battle_* types pass `battle` so the frontend can route correctly.
 *
 * @param {Object} data { recipient, actor, type, sketch?, battle? }
 * @returns {Promise<Notification|null>}
 */
export const createNotification = async (data) => {
  try {
    // Don't notify yourself (e.g. liking your own sketch)
    if (
      data.recipient &&
      data.actor &&
      data.recipient.toString() === data.actor.toString()
    ) {
      return null;
    }
    const notification = await NotificationModel.create(data);
    return notification;
  } catch (err) {
    console.error("createNotification error:", err);
    return null;
  }
};

/**
 * Notify everyone who commented on a sketch (except the actor and the
 * sketch owner — the owner gets a "comment" notification instead).
 */
export const notifyCommentReplies = async (sketchId, actorId, ownerId) => {
  try {
    const comments = await CommentModel.find({ sketch: sketchId }, "owner");
    const uniqueOwners = [
      ...new Set(comments.map((c) => c.owner?.toString()).filter(Boolean)),
    ];

    const recipients = uniqueOwners.filter(
      (id) => id !== actorId.toString() && id !== ownerId.toString()
    );

    await Promise.all(
      recipients.map((recipientId) =>
        createNotification({
          recipient: recipientId,
          actor: actorId,
          type: "comment_reply",
          sketch: sketchId,
        })
      )
    );
  } catch (err) {
    console.error("notifyCommentReplies error:", err);
  }
};

// ============================================================
// API ENDPOINTS
// ============================================================

export const listNotifications = async (req, res) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const [notifications, unreadCount] = await Promise.all([
      NotificationModel.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate({ path: "actor", select: "username avatar" })
        .populate({ path: "sketch", select: "name url" })
        .populate({ path: "battle", select: "theme state" })
        .lean(),
      NotificationModel.countDocuments({
        recipient: req.user._id,
        read: false,
      }),
    ]);

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error("listNotifications error:", error);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await NotificationModel.countDocuments({
      recipient: req.user._id,
      read: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("getUnreadCount error:", error);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notif = await NotificationModel.findById(req.params.id);
    if (!notif) return res.status(404).json({ error: "Notification not found" });
    if (notif.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No autorizado" });
    }
    notif.read = true;
    await notif.save();
    res.status(200).json({ msg: "Marked as read" });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await NotificationModel.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ msg: "All marked as read" });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notif = await NotificationModel.findById(req.params.id);
    if (!notif) return res.status(404).json({ error: "Notification not found" });
    if (notif.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No autorizado" });
    }
    await NotificationModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Notification deleted" });
  } catch (error) {
    console.error("deleteNotification error:", error);
    res.status(500).json({ error: "Algo salió mal" });
  }
};
