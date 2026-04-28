import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

// All routes require authentication
notificationRouter.get("/", jwtAuth, listNotifications);
notificationRouter.get("/unread-count", jwtAuth, getUnreadCount);
notificationRouter.post("/:id/read", jwtAuth, markAsRead);
notificationRouter.post("/read-all", jwtAuth, markAllAsRead);
notificationRouter.delete("/:id", jwtAuth, deleteNotification);

export default notificationRouter;
