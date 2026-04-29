import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";

import userRouter from "./routes/userRoutes.js";
import sketchRouter from "./routes/sketchRoutes.js";
import commentRouter from "./routes/commentsRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import battleRouter from "./routes/battleRoutes.js";
import { runStateTransitions } from "./controllers/battleController.js";
import cloudinaryConfig from "./config/cloudinary.js";
import passportConfig from "./config/passport.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ---------- CORS ----------
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

// ---------- Middlewares ----------
const setMiddlewares = () => {
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cors(corsOptions));
  app.use(generalLimiter);
  app.set("trust proxy", 1);

  cloudinaryConfig();
  passportConfig();
};

// ---------- DB ----------
const connectMongoose = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(port, () => {
        console.log(`✅ MongoDB connected — server running on port ${port}`);
        // Run battle state transitions on startup, then every 10 minutes.
        // Cheap, idempotent — just checks dates and updates docs if needed.
        runStateTransitions().catch((e) =>
          console.error("Initial battle transition check failed:", e)
        );
        setInterval(() => {
          runStateTransitions().catch((e) =>
            console.error("Periodic battle transition check failed:", e)
          );
        }, 10 * 60 * 1000);
      });
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));
};

// ---------- Routes ----------
const connectRoutes = () => {
  app.use("/api/users", userRouter);
  app.use("/api/sketches", sketchRouter);
  app.use("/api/comments", commentRouter);
  app.use("/api/notifications", notificationRouter);
  app.use("/api/battles", battleRouter); // NEW

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
  });
};

setMiddlewares();
connectMongoose();
connectRoutes();
