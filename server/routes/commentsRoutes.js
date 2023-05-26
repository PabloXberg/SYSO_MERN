import express from 'express'
import {createComment } from "../controllers/commentsController.js" 
import { multerUploads } from '../middlewares/multer.js'
import jwtAuth from '../middlewares/jwtAuth.js'

const commentRouter = express.Router();

// commentRouter.get("/all", getAllSketches);


commentRouter.post("/new", jwtAuth,  createComment);
// commentRouter.post("/like", jwtAuth,  addLike);
// commentRouter.post("/unlike", jwtAuth, deleteLike);


export default commentRouter