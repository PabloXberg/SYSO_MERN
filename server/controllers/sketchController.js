import SketchModel from "../models/sketchModel.js";
import imageUpload from "../utils/imageManagement.js";
import UserModel from "../models/userModels.js";


///////////////////////////////////////////////////////////// GET ALL SWKETCHES FROM MONGO

const getAllSketches = async (req, res) => {
try {
  const sketch = await SketchModel.find()
    .populate({ path: "owner", select: ["email", "username", "avatar", "likes", "sketchs", "createdAt", "info"] })
 
    .populate("comments")
    res.status(200).json(sketch)
} catch (error) {
    console.log(error);
    res.status(500).json({error: "algo salió pal carajo..."})
    }
}



/// FUNCIONA; PERO TENGO QUE QUITAR LOS COMENTARIOS RELACIONADOS AUN
const deleteSketch = async (req, res) => {
        try {
        // console.log('req.body :>> ', req.body);
        const deletedSketch = await SketchModel.findByIdAndDelete(req.body._id);
        const updatedUser = await deleteSketchToUser(req.body.owner, req.body._id);   //// DEBERIA QUITAR LOS LIKES DE LOS USUARIOS; Y LOS COMENTARIOS RELACIONADOS
        // const updatedSketch = await deleteCommentToSketch(req.body.sketch, deletedSketch);
        
        res.status(200).json({
            message: "Sketch borrado!! ",
             userUpdated: updatedUser,
          // sketchUpdated:updatedSketch,
            deletedSketch: deletedSketch
        })
  } catch (error) {
    console.log(error);
    res.status(500).json("No se puede borrar su mensaje...")
  }
}



////FUNCIONAAAAAA
const updateSketch = async (req, res) => {
  const infoToUpdate = {};

  if (req.body.name !== "") infoToUpdate.name = req.body.name;
  if (req.body.comment !== "") infoToUpdate.comment = req.body.comment;

  if (req.file) {
    console.log('req.file :>> ', req.file);
    const URL = await imageUpload(req.file, "user_sketches")
    infoToUpdate.url = URL
  }
  
  try {
    const updatedSketch = await SketchModel.findByIdAndUpdate(req.body._id, infoToUpdate, { new: true });
    res.status(200).json(updatedSketch); // QUITAR EL PASSWORD DE ESTE OBJETO ANTES DE MANDARLO PARA EL FRONT END
    // Y SI QUIERO PUEDO MANDAR UN MENSAJE DE "Update Successfully!!!!"; AUNQUE CREO QUE EN EL FRONT END YA HAY UNO

  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).json(error.message)
    
  }
}

///////////////////////////////////////////////////////////////////////// GET JUST ONE SKETCH BY ID

const getSketchbyID = async(req, res) => {

    try {
      const user = await SketchModel.findById(req.params.id)
     .populate({ path: "owner", select: ["email", "username", "avatar", "likes", "sketchs", "createdAt", "info"] })
       .populate({
          path: "likes",
          populate: [
            { path: 'owner', select: ['username'] }
                 
          ]
       })
        .populate({ path: "likes", select: ["_id"] })
     .populate({
          path: "comments",
          populate: [
            { path: 'owner', select: ['username'] }
                 
          ]
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:"Something went wrong..."})
        console.log(error);
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
  try {
   await SketchModel.findByIdAndUpdate(req.body.sketch,
      { $push: { likes: req.user._id } },
      { new: true });
    
    await UserModel.findByIdAndUpdate(req.user._id,
      { $push: { likes: req.body.sketch} },
      {new: true}
     )

    res.status(200).json({message: "Success!!!! liked "})
    
  } catch (error) {
    res.status(500).json({error: "Algo Salió mal... muy mal.... " + error.message})
  }
}

const deleteLike = async (req, res) => {

  try {
    await SketchModel.findByIdAndUpdate(req.body.sketch,
      { $pull: { likes: req.user._id } },
      { new: true });
   
    await UserModel.findByIdAndUpdate(req.user._id,
      { $pull: { likes: req.body.sketch } },
      {new: true}
     )
    
     res.status(200).json({message: "Success!!!! unliked "})

    
  } catch (error) {
    res.status(500).json({error: "Algo Salió mal... muy mal.... " + error.message})
  }
}

const deleteSketchToUser = async (userId, sharedPost) => {

    try {
        const result = await UserModel.findByIdAndUpdate(userId,
            { $pull: { sketchs: sharedPost} },
            { new: true }
        )
        console.log("user making post....", result);
        return true
    } catch (error) {
        console.log(error)
        return false
    }   
};
 
export { getAllSketches, createSketch, addLike, deleteLike, getSketchbyID, deleteSketch, updateSketch}