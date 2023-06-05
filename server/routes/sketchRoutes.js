import express from 'express'
import { getAllSketches, createSketch, addLike, deleteLike, getSketchbyID,updateSketch ,deleteSketch} from "../controllers/sketchController.js" 
import { multerUploads } from '../middlewares/multer.js'
import jwtAuth from '../middlewares/jwtAuth.js'

const sketchRouter = express.Router();

sketchRouter.get("/all", getAllSketches);
sketchRouter.get("/id/:id",jwtAuth,  getSketchbyID)

sketchRouter.post("/new", jwtAuth, multerUploads.single("url"), createSketch);
sketchRouter.post("/update/:id", jwtAuth, multerUploads.single("url"), updateSketch)    /// debería ser method PUT???

sketchRouter.post("/like", jwtAuth,  addLike);
sketchRouter.post("/unlike", jwtAuth, deleteLike); /// debería ser method delete???

sketchRouter.delete("/delete/:id", jwtAuth, deleteSketch) /// borrar la colleccion del sketch (deberia boorar los likes y comentarios de las otras collecciones... pero en este caso creo que no altera el funcionamiento... pero lo ideal seria borrar eso tambien)
/// no funciona delete sketch, y no se porque

export default sketchRouter