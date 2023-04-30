import express from 'express'
import { getAllSketches } from "../controllers/sketchController.js" 

const sketchRouter = express.Router();

sketchRouter.get("/all", getAllSketches);


export default sketchRouter