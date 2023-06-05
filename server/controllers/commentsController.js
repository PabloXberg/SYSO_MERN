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
const deleteCommentToUser = async (userId, sharedPost) => {
    try {
        const result = await UserModel.findByIdAndUpdate(userId,
            { $pull: { comments: sharedPost._id } },
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
const deleteCommentToSketch = async (sketchId, sharedPost) => {
    try {
        const result = await SketchModel.findByIdAndUpdate(sketchId,
            { $pull: { comments: sharedPost._id } },
            { new: true }
        )
        console.log("user making post on this sketch...", result);
        return true
    } catch (error) {
        console.log(error)
        return false
    }   
};


const deleteComment = async (req, res) => {

    try {
    // console.log('req.body :>> ', req.body);
        const deletedComment = await CommentModel.findByIdAndRemove(req.body._id);
        const updatedUser = await deleteCommentToUser(req.body.owner, registeredComment);
        const updatedSketch = await deleteCommentToSketch(req.body.sketch, registeredComment);
        
        res.status(200).json({
            message: "Mensaje borrado!! ",
            userUpdated: updatedUser,
            sketchUpdated:updatedSketch,
            deletedComment: deletedComment
        })
  } catch (error) {
    console.log(error);
    res.status(500).json("No se puede borrar su mensaje...")
  }
}

const updatecomment = async (req, res) => {
      
}


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
    res.status(500).json("No se puede guardar su mensaje...")
  }
}

export {createComment, updatecomment, deleteComment}