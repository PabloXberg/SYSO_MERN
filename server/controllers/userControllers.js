import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import UserModel from "../models/userModels.js";
import SketchModel from "../models/sketchModel.js";
import CommentModel from "../models/commentModel.js";
import imageUpload from "../utils/imageManagement.js";
import { encryptPassword, verifyPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const testingRoute = (req, res) => {
  res.send("testing route...");
};

// ==============================================================
// FORGOT / RESET PASSWORD
// ==============================================================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requerido" });
  }

  try {
    const user = await UserModel.findOne({ email });

    // SECURITY: respond the same whether the email exists or not,
    // so attackers can't enumerate valid accounts.
    if (!user) {
      return res.status(200).json({
        message: "Si el email existe, hemos enviado un link para resetear la contraseña",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // SECURITY: credentials now come from .env instead of being hardcoded.
    // Also the client URL is an env var so we're not hardcoding the domain.
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/resetPassword/${token}`;

    const mailOptions = {
      to: email,
      from: `Share Your Sketch <${process.env.EMAIL_USER}>`,
      subject: "Cambio de Contraseña",
      text: `¡Hola! 😎

Estás recibiendo este correo porque tú (o alguien más) solicitó restablecer la contraseña de tu cuenta.

Haz clic en el siguiente enlace (o cópialo y pégalo en tu navegador):
${resetUrl}

Este enlace expirará en 1 hora.

Si no solicitaste esto, ignora este mensaje — tu contraseña seguirá siendo la misma.

¡Saludos!
El equipo de Share Your Sketch 🎨`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Hemos enviado a tu casilla de correo un link para resetear tu contraseña",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Error de servidor / no se pudo enviar el email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Este link es inválido o ya ha expirado" });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe contener por lo menos 6 caracteres" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "La contraseña se ha actualizado con éxito" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

// ==============================================================
// USERS CRUD
// ==============================================================
const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();

    // Build filter. When ?search=xxx is provided, match username or info
    // (case-insensitive). Special regex chars are escaped so "foo.bar" works.
    let filter = {};
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter = {
        $or: [{ username: regex }, { info: regex }],
      };
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("-password -resetPasswordToken -resetPasswordExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "sketchs",
          populate: { path: "owner" },
        }),
      UserModel.countDocuments(filter),
    ]);

    res.status(200).json({
      msg: "Success!",
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + users.length < total,
      },
    });
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ error: "Algo salió mal..." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate({
        path: "likes",
        populate: [{ path: "owner", select: ["username"] }],
      })
      .populate({
        path: "sketchs",
        populate: [{ path: "owner", select: ["username"] }],
      })
      .populate("comments");

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    console.error("getUser error:", error);
    res.status(500).json({ error: "Algo salió mal..." });
  }
};

const createUser = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(406).json({
      error: "Falta rellenar alguno de los campos obligatorios (*)",
    });
  }

  try {
    // Check for existing user BEFORE uploading the avatar — saves a Cloudinary
    // upload when the email is already taken.
    const existing = await UserModel.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({ error: "Ya existe un usuario con ese email" });
    }

    const avatar = await imageUpload(req.file, "user_avatar");
    const encryptedPassword = await encryptPassword(req.body.password);

    const newUser = new UserModel({
      ...req.body,
      password: encryptedPassword,
      avatar: avatar,
    });

    const registeredUser = await newUser.save();

    // Don't send the password back
    const userResponse = registeredUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Registrado Exitosamente",
      newUser: userResponse,
    });
  } catch (error) {
    console.error("createUser error:", error);
    // BUG FIX: was `.jason(...)` which crashes the server (method doesn't exist)
    res.status(500).json({ error: "Algo salió mal..." });
  }
};

const updateUser = async (req, res) => {
  const infoToUpdate = {};
  if (req.body.email) infoToUpdate.email = req.body.email;
  if (req.body.username) infoToUpdate.username = req.body.username;
  if (req.body.info) infoToUpdate.info = req.body.info;

  // If the password is being updated, hash it first
  if (req.body.password) {
    infoToUpdate.password = await encryptPassword(req.body.password);
  }

  if (req.file) {
    const avatar = await imageUpload(req.file, "user_avatar");
    infoToUpdate.avatar = avatar;
  }

  try {
    // Uses req.user._id from JWT — ignores the :id in the URL (safer).
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      infoToUpdate,
      { new: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({ error: error.message });
  }
};

// IMPLEMENTED: was previously an empty function.
// Deletes the user AND cleans up all related data so we don't leave orphans.
const deleteUser = async (req, res) => {
  const userId = req.user._id;

  try {
    // 1. Delete all comments that belong to this user
    await CommentModel.deleteMany({ owner: userId });

    // 2. Find all sketches owned by this user (we need their IDs to clean up comments on them)
    const userSketches = await SketchModel.find({ owner: userId }, "_id");
    const sketchIds = userSketches.map((s) => s._id);

    // 3. Delete all comments on those sketches (from OTHER users)
    if (sketchIds.length > 0) {
      await CommentModel.deleteMany({ sketch: { $in: sketchIds } });
    }

    // 4. Delete the sketches themselves
    await SketchModel.deleteMany({ owner: userId });

    // 5. Remove this user's likes from all remaining sketches
    await SketchModel.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );

    // 6. Remove the deleted sketches from OTHER users' likes arrays
    if (sketchIds.length > 0) {
      await UserModel.updateMany(
        { likes: { $in: sketchIds } },
        { $pull: { likes: { $in: sketchIds } } }
      );
    }

    // 7. Finally, delete the user
    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "Usuario y todos sus datos eliminados correctamente" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

// ==============================================================
// AUTH
// ==============================================================
const loginUser = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(406).json({
      error: "Falta rellenar alguno de los campos obligatorios (*)",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email: req.body.email }).populate("sketchs");
    if (!existingUser) {
      return res.status(404).json({ error: "El correo o el password no son correctos" });
    }

    const verified = await verifyPassword(req.body.password, existingUser.password);
    if (!verified) {
      return res.status(406).json({ error: "El correo o el password no son correctos" });
    }

    const token = generateToken(existingUser);
    res.status(200).json({
      verified: true,
      token,
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        sketchs: existingUser.sketchs,
        likes: existingUser.likes,
        comments: existingUser.comments,
        info: existingUser.info,
        avatar: existingUser.avatar,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ error: "Algo salió mal..." });
  }
};

const getActiveUser = async (req, res) => {
  // PERF: passport no longer populates sketchs/likes/comments on every request
  // (used to be ~5 DB queries per authenticated request). We populate here
  // on demand since the frontend's AuthContext expects these fields.
  try {
    const user = await UserModel.findById(req.user._id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate({
        path: "sketchs",
        populate: { path: "owner", select: "username" },
      })
      .populate({
        path: "likes",
        populate: { path: "owner", select: "username" },
      })
      .populate("comments");

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    console.error("getActiveUser error:", error);
    res.status(500).json({ error: "Algo salió mal..." });
  }
};

export {
  testingRoute,
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  getActiveUser,
  deleteUser,
};
