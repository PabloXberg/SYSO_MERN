import CommentModel from "../models/commentModel.js";
import SketchModel from "../models/sketchModel.js";
import UserModel from "../models/userModels.js";



const addCommentToUser = async (userId, sharedPost) => {
    try {
        const result = await UserModel.findByIdAndUpdate(userId,
            { $push: { comments: sharedPost._id } },
            { new: true }
        )
        console.log("user making post....", result);
        return true
    } catch (error) {
        console.log(error)
        return false
    }   
};

const addCommentToSketch = async (sketchId, sharedPost) => {
    try {
        const result = await SketchModel.findByIdAndUpdate(sketchId,
            { $push: { comments: sharedPost._id } },
            { new: true }
        )
        console.log("user making post on this sketch...", result);
        return true
    } catch (error) {
        console.log(error)
        return false
    }   
};


const createComment = async (req, res) => {
  if (!req.body.comment) {
    return res.status(406).json({ error: "Please fill out all fields" })
  }

  const newComment = new CommentModel({
      ...req.body,
      comment: req.body.comment,
      owner: req.body.owner, 
      sketch:req.body.sketch
  });

    try {
      
        const registeredComment = await newComment.save();
        const updatedUser = await addCommentToUser(req.body.owner, registeredComment);
        const updatedSketch = await addCommentToSketch(req.body.sketch, registeredComment);
        
        res.status(200).json({
            message: "Mensaje guardado!! ",
            userUpdatd: updatedUser,
            sketchUpdated:updatedSketch,
            newComment: registeredComment
        })
  } catch (error) {
    console.log(error);
    res.status(500).jason("No se puede guardar su mensaje...")
  }
}

export {createComment}