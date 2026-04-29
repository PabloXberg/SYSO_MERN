import express from "express";
import {
  getAllBattles,
  getCurrentBattle,
  getBattleById,
  createBattle,
  updateBattle,
  deleteBattle,
  triggerStateTransitions,
} from "../controllers/battleController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import adminAuth from "../middlewares/adminAuth.js";

const battleRouter = express.Router();

// Public reads — anyone can see battles
battleRouter.get("/", getAllBattles);
battleRouter.get("/current", getCurrentBattle);
battleRouter.get("/:id", getBattleById);

// Admin-only writes
battleRouter.post("/", jwtAuth, adminAuth, createBattle);
battleRouter.put("/:id", jwtAuth, adminAuth, updateBattle);
battleRouter.delete("/:id", jwtAuth, adminAuth, deleteBattle);
battleRouter.post("/run-transitions", jwtAuth, adminAuth, triggerStateTransitions);

export default battleRouter;
