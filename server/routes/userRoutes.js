import express from "express";
import { multerUploads } from "../middlewares/multer.js";
import {
  testingRoute,
  getUsers,
  getUser,
  getUserStats,
  createUser,
  updateUser,
  loginUser,
  getActiveUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userControllers.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import {
  authLimiter,
  passwordResetLimiter,
} from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

// Public reads
userRouter.get("/test", testingRoute);
userRouter.get("/all", getUsers);
userRouter.get("/id/:id", getUser);
userRouter.get("/id/:id/stats", getUserStats);
userRouter.get("/active", jwtAuth, getActiveUser);

// Auth endpoints — rate limited against brute force
userRouter.post("/new", authLimiter, multerUploads.single("avatar"), createUser);
userRouter.post("/login", authLimiter, loginUser);

// Authenticated actions
userRouter.post("/update/:id", jwtAuth, multerUploads.single("avatar"), updateUser);
userRouter.delete("/delete/:id", jwtAuth, deleteUser);

// Password reset — strictly rate limited
userRouter.post("/forgotpassword", passwordResetLimiter, forgotPassword);
userRouter.post("/resetpassword/:token", passwordResetLimiter, resetPassword);

export default userRouter;
