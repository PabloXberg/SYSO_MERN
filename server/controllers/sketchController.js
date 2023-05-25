import SketchModel from "../models/sketchModel.js";
import imageUpload from "../utils/imageManagement.js";
import UserModel from "../models/userModels.js";


///////////////////////////////////////////////////////////// GET ALL SWKETCHES FROM MONGO

const getAllSketches = async (req, res) => {
try {
    const sketch = await SketchModel.find().populate({path:"owner", select: ["email", "username", "avatar", "likes", "sketchs", "createdAt","info"]});
    res.status(200).json(sketch)
} catch (error) {
    console.log(error);
    res.status(500).json({error: "algo salió pal carajo..."})
    }
}

////////////////////////////////////////////////////////////// THIS FUNCTION SAVE THE SKETCH ID ON THE OWNER COLLECTION
const addSketchToUser = async (userId, sharedPost) => {
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

///////////////////////////////////////////////////////////// CREATE FUNCTION - NEW SKETCH COLLECTION
const createSketch = async (req, res) => {

  const URL = await imageUpload(req.file, "user_sketches") //// ADDING TO CLOUDINARY AND SAVING URL ADRESS

  const newSketch = new SketchModel({  /////////////////// PREPARING MOGOOSE MODEL 
    ...req.body,
    name: req.body.name,
    comment: req.body.comment,
    url: URL,
    owner: req.body.owner
  });
       
    try {
         const sketchToSave = await newSketch.save();    
        const updatedUser = await addSketchToUser(req.body.owner, sketchToSave);

      res.status(200).json({
          update_status: updatedUser,
          message: "Sketch Successfully Upload, Yeahhhh!",
          newSketch: sketchToSave
      })

  } catch (error) {
    console.log(error);
    res.status(500).json("Algo no quedo muy bien que digamos....")
  }
}



const addLike = async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>req.body :>> ', req.body);
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>req.user :>> ', req.user._id);

  try {
    const like = SketchModel.findByIdAndUpdate(req?.body._id,
      { $push: { likes: req?.user._id } },
      { new: true });
    
    const addToFavo = await UserModel.findByIdAndUpdate(req?.user._id,
      { $push: { likes: req?.sketch._id } },
      {new: true}
     )
    
    console.log("El ususario ha borrado el like del siguiente sketch..." + like);
    // res.status(200).json({message: "Algo Salió mal... muy mal.... " + error.message})
    
  } catch (error) {
    res.status(500).json({error: "Algo Salió mal... muy mal.... " + error.message})
  }
}

const deleteLike = async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>req.body :>> ', req.body);
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>req.user :>> ', req.user);

  try {
    const unlike = SketchModel.findByIdAndUpdate(req.body._id,
      { $pull: { likes: req.user._id } },
      { new: true });
    
    const deleteFromFavo = await UserModel.findByIdAndUpdate(req.user._id,
      { $pull: { likes: req.sketch._id } },
      {new: true}
     )
    
    console.log("El ususario ha borrado el like del siguiente sketch..." + unlike);
    // res.status(200).json({message: "Algo Salió mal... muy mal.... " + error.message})
    
  } catch (error) {
    res.status(500).json({error: "Algo Salió mal... muy mal.... " + error.message})
  }
}
 
export { getAllSketches, createSketch, addLike, deleteLike}