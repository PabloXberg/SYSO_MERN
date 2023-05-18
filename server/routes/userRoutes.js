import express from 'express'
import { multerUploads } from '../middlewares/multer.js'
import { testingRoute, getUsers, getUser, createUser, updateUser, loginUser, getActiveUser} from '../controllers/userControllers.js'
import jwtAuth from '../middlewares/jwtAuth.js'
const userRouter = express.Router()

userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUser)
userRouter.get("/active", jwtAuth, getActiveUser)

userRouter.post("/new", multerUploads.single("avatar"), createUser)
userRouter.post("/update/:id", jwtAuth,updateUser)
userRouter.post("/login", loginUser)

export default userRouter