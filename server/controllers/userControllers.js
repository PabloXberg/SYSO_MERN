import UserModel from "../models/userModels.js";
import imageUpload from "../utils/imageManagement.js";
import { encryptPassword, verifyPassword } from "../utils/bcrypt.js";

const testingRoute = (req, res) => {
  res.send('testing route....')
}

const getUsers = async(req, res) => {
  try { 
    const users = await UserModel.find().populate("sketchs");
    res.status(200).json({msg: "Success!", users});
  } catch (e) {
      res.status(500).json({error: "Something went wrong..."});
    console.log(e);
  }
}

const getUser = async(req, res) => {

  const params = req.params;
  console.log(params); // should show {id: bla bla bla}
  const id = req.params.id // will show just "bla bla bla"
  console.log('id :>> ', id);
  
    try {
        const user = await UserModel.findById(id).populate("sketchs");
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

 const updateUser = async(req, res) => {
         try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
           res.status(200).json(updatedUser);
           message("Update Successfully!!!!")
    	}catch(e) {
            console.log(e);
            res.status(500).send(e.message);
      }
    }

const loginUser = async (req,res) => {
// console.log('req.body :>> ', req.body);
     try {
        const existingUser = await UserModel.findOne({ email: req.body.email });
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
             res.status(200).json({
               verified: true,
               user: {
                 _id: existingUser._id,
                 username: existingUser.username,
                 pets: existingUser.pets,
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

export {testingRoute, getUsers, getUser, createUser, updateUser, loginUser}