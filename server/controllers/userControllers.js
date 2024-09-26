import UserModel from "../models/userModels.js";
import imageUpload from "../utils/imageManagement.js";
import { encryptPassword, verifyPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const testingRoute = (req, res) => {
  res.send('testing route....')
}

// userControllers.js
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
//import User from '../models/User.js'; // Asegúrate de importar tu modelo de usuario

// Controlador para "Forgot Password"
export const forgotPassword = async (req, res) => {

  
  const { email } = req.body;
console.log('email :>> ', email);
  try {
    const user = await UserModel.findOne({email});
    console.log('user :>> ', user);

    if (!user) {
      return res.status(404).json({ message: 'No user with that email' });
    }

    // Generar un token único
    const token = crypto.randomBytes(20).toString('hex');

    // Establecer el token y su tiempo de expiración
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora desde ahora

    await user.save();

    // Enviar un correo con el enlace de restablecimiento de contraseña
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'pabloxberg@gmail.com', // Tu correo de Gmail
        pass: 'stcm bgww vwgp ndli', // O un App Password si usas autenticación en dos pasos
      },
    });
console.log('transporter :>> ', transporter);
    const mailOptions = {
      to: email,
      from: 'pabloxberg@gmail.com',
      subject: 'Password Reset',
      text: `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        https://shareyoursketch.vercel.app/resetpassword/${token}
        If you did not request this, please ignore this email and your password will remain unchanged.
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset link sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Controlador para "Reset Password"
export const resetPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // Asegurarse de que el token no ha expirado
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Validar la nueva contraseña
    const { password } = req.body;
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash la nueva contraseña y guardarla
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getUsers = async(req, res) => {
  try { 
    const users = await UserModel.find().populate({
      path: 'sketchs',
      populate: {
        path: 'owner',
      }
    });

    res.status(200).json({msg: "Success!", users});
  } catch (e) {
      res.status(500).json({error: "Algo salió mal..."});
    console.log(e);
  }
}

const getUser = async (req, res) => {
  //   if (!req.body.email || !req.body.password ) {
  //   return res.status(406).json({ error: "Falta rellnar alguno de los campos obligatorios (*)" })
  // }

  const params = req.params;
  // console.log(params);  should show {id: bla bla bla}
  const id = req.params.id // will show just "bla bla bla"
  
    try {
        const user = await UserModel.findById(id).populate({ path: "likes",
                populate: [
                    { path: 'owner', select: ['username'] }
                 
                ]
            })
          .populate({ path: "sketchs",
                populate: [
                    { path: 'owner', select: ['username'] }
                 
                ]
            })
      .populate("comments")
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:"Algo salió mal..."})
        console.log(error);
    }
 }

const createUser = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(406).json({ error: "Falta rellnar alguno de los campos obligatorios (*)" })
  }

  const avatar = await imageUpload(req.file, "user_avatar")
  const encryptedPassword = await encryptPassword(req.body.password)
  // console.log('avatar.public_id :>> ', avatar.public_id);
  // let avatar_public_id = "Avatar_default"
  // avatar.public_id ? avatar_public_id = avatar.public_id : avatar_public_id = "Default_avatar";

  const newUser = new UserModel({
    // email: req.body.email,
    // username: req.body.username,
    ...req.body,
    password: encryptedPassword,
    avatar: avatar
    // ,avatar_public_id: avatar.public_id
  });

  try {
    const registeredUser = await newUser.save();
    res.status(200).json ({message: "Succesfully Registered", newUser: registeredUser})
  } catch (error) {
    console.log(error);
    res.status(500).jason("Algo salió mal...")
  }
}

const updateUser = async (req, res) => {
  
  const infoToUpdate = {};
  if (req.body.email !== "") infoToUpdate.email = req.body.email;
  if (req.body.username !== "") infoToUpdate.username = req.body.username;
  if (req.body.info !== "") infoToUpdate.info = req.body.info;

  if (req.file) {
    const avatar = await imageUpload(req.file, "user_avatar")
    infoToUpdate.avatar = avatar
}
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, infoToUpdate, { new: true });
    res.status(200).json(updatedUser); // QUITAR EL PASSWORD DE ESTE OBJETO ANTES DE MANDARLO PARA EL FRONT END
    // Y SI QUIERO PUEDO MANDAR UN MENSAJE DE "Update Successfully!!!!"; AUNQUE CREO QUE EN EL FRONT END YA HAY UNO

  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).json(error.message)
    
  }
  
    }


const deleteUser = async (req, res) => {
      
    }

    
const loginUser = async (req,res) => {
  // console.log('req.body :>> ', req.body);
   if (!req.body.email || !req.body.password ) {
    return res.status(406).json({ error: "Falta rellnar alguno de los campos obligatorios (*)" })
  }

  
     try {
        const existingUser = await UserModel.findOne({ email: req.body.email }).populate("sketchs");
        if (!existingUser) {
          res.status(404).json({error: "El correo o el password no son correctos"})
          return;
        }
        if (existingUser) {
          const verified = await verifyPassword(req.body.password, existingUser.password);
          if (!verified) {
             res.status(406).json({ error: "El correo o el password no son correctos" })
          }
          if (verified) {
            const token = generateToken(existingUser);
             res.status(200).json({
               verified: true,
               token: token,
               user: {
                 _id: existingUser._id,
                 email: existingUser.email,
                 username: existingUser.username,
                 sketchs: existingUser.sketchs,
                 likes: existingUser.likes,
                 comments: existingUser.comments,
                 info: existingUser.info,
                 avatar: existingUser.avatar
               }
               
              })
            }
        }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Algo salió mal..." })
  }

}

const getActiveUser = async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    username: req.user.username,
    info: req.user.info,  
    sketchs: req.user.sketchs,
    likes: req.user.likes,
    comments: req.user.comments,
    avatar: req.user.avatar
    })

  // res.send(req.user)
}


export {testingRoute, getUsers, getUser, createUser, updateUser, loginUser, getActiveUser, deleteUser}