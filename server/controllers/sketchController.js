import SketchModel from "../models/sketchModel.js";
import imageUpload from "../utils/imageManagement.js";
import UserModel from "../models/userModels.js";

const getAllSketches = async (req, res) => {
    
try {
    const sketch = await SketchModel.find().populate({path:"owner", select: ["email", "username", "avatar", "likes", "sketchs", "createdAt","info"]});
    res.status(200).json(sketch)
} catch (error) {
    console.log(error);
    res.status(500).json({error: "algo salió pal carajo..."})
    }
}


const addPostToUser = async (userId, sharedPost) => {
    try {
        const result = await UserModel.findByIdAndUpdate(userId,
            { $push: { sketchs: sharedPost._id } },
            { new: true }
        )
        console.log("user making post....", result);
        return true
    } catch (error) {
        console.log(error)
        return false
    }   
};


const createSketch = async (req, res) => {


  const URL = await imageUpload(req.file, "user_sketches")

  const newSketch = new SketchModel({
    ...req.body,
    name: req.body.name,
    comment: req.body.comment,
    url: URL,
    owner: req.body.owner
 
  });
       

    try {
         const sketchToSave = await newSketch.save();
        console.log('sketchToSave :>> ', sketchToSave);
        console.log('req.body:>> ', req.body);
    
        const updatedUser = await addPostToUser(req.body.owner, sketchToSave);

      res.status(200).json({
          update_status: updatedUser,
          message: "Sketch Successfully Upload, Yeahhhh!",
          newSketch: sketchToSave
      })
  } catch (error) {
    console.log(error);
    res.status(500).jason("Algo no quedo muy bien que digamos....")
  }
}




export { getAllSketches, createSketch}