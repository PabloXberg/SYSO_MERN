import express from 'express'
import { getAllSketches, createSketch, addLike, deleteLike, getSketchbyID} from "../controllers/sketchController.js" 
import { multerUploads } from '../middlewares/multer.js'
import jwtAuth from '../middlewares/jwtAuth.js'

const sketchRouter = express.Router();

sketchRouter.get("/all", getAllSketches);
sketchRouter.get("/id/:id",jwtAuth,  getSketchbyID)

sketchRouter.post("/new", jwtAuth, multerUploads.single("url"), createSketch);
sketchRouter.post("/like", jwtAuth,  addLike);
sketchRouter.post("/unlike", jwtAuth, deleteLike);


export default sketchRouter