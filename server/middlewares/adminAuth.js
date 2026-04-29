import UserModel from "../models/userModels.js";

/**
 * Admin-only guard. Use AFTER jwtAuth in route definitions.
 * Looks up the user fresh from DB (instead of trusting the token payload)
 * so that revoking admin takes effect immediately on the next request.
 */
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "No autenticado" });
    }
    const user = await UserModel.findById(req.user._id, "isAdmin").lean();
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Solo administradores" });
    }
    next();
  } catch (err) {
    console.error("adminAuth error:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
};

export default adminAuth;
