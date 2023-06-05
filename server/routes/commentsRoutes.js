import express from 'express'
import {createComment, deleteComment, updatecomment } from "../controllers/commentsController.js" 
import { multerUploads } from '../middlewares/multer.js'
import jwtAuth from '../middlewares/jwtAuth.js'

const commentRouter = express.Router();

// commentRouter.get("/all", getAllSketches);


commentRouter.post("/new", jwtAuth, createComment);
commentRouter.post("/update/:id", jwtAuth, updatecomment)    /// debería ser method PUT???
// commentRouter.post("/like", jwtAuth,  addLike);
// commentRouter.post("/unlike", jwtAuth, deleteLike);
commentRouter.delete("/delete/:id", jwtAuth, deleteComment) /// borrar la colleccion del comentario y de los arrays del user y el sketch
export default commentRouter