import UserModel from "../models/userModels.js";
import imageUpload from "../utils/imageManagement.js";
import { encryptPassword, verifyPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const testingRoute = (req, res) => {
  res.send('testing route....')
}

const getUsers = async(req, res) => {
  try { 
    const users = await UserModel.find().populate({
      path: 'sketchs',
      populate: {
        path: 'owner'
      }
    });

    res.status(200).json({msg: "Success!", users});
  } catch (e) {
      res.status(500).json({error: "Something went wrong..."});
    console.log(e);
  }
}

const getUser = async(req, res) => {

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
        res.status(500).json({error:"Something went wrong..."})
        console.log(error);
    }
 }

const createUser = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(406).json({ error: "Please fill out all fields" })
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
    res.status(500).jason("Something went wrong...")
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


    
const loginUser = async (req,res) => {
// console.log('req.body :>> ', req.body);
     try {
        const existingUser = await UserModel.findOne({ email: req.body.email }).populate("sketchs");
        if (!existingUser) {
          res.status(404).json({error: "No user found"})
          return;
        }
        if (existingUser) {
          const verified = await verifyPassword(req.body.password, existingUser.password);
          if (!verified) {
             res.status(406).json({ error: "password doesn't match" })
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
    res.status(500).json({ error: "something went wrong.." })
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


export {testingRoute, getUsers, getUser, createUser, updateUser, loginUser, getActiveUser}