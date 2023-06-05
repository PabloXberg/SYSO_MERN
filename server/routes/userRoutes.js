import express from 'express'
import { multerUploads } from '../middlewares/multer.js'
import { testingRoute, getUsers, getUser, createUser, updateUser, loginUser, getActiveUser, deleteUser} from '../controllers/userControllers.js'
import jwtAuth from '../middlewares/jwtAuth.js'
const userRouter = express.Router()

userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUser)
userRouter.get("/active", jwtAuth, getActiveUser)

userRouter.post("/new", multerUploads.single("avatar"), createUser)
userRouter.post("/update/:id", jwtAuth, multerUploads.single("avatar"), updateUser)
userRouter.post("/login", loginUser)
userRouter.delete("/delete/:id", jwtAuth, deleteUser) /// aqui se deberia borrar al usuario pero tambien sus trabajos, comentarios y likes

export default userRouter