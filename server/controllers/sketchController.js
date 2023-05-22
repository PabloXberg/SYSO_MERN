import SketchModel from "../models/sketchModel.js";


const getAllSketches = async(req,res) => {
try {
    const sketch = await SketchModel.find().populate({path:"owner", select: ["email", "username", "avatar", "likes", "sketchs", "createdAt","info"]});
    res.status(200).json(sketch)
} catch (error) {
    console.log(error);
    res.status(500).json({error: "algo salió como el carajo..."})
}

}
export { getAllSketches }