import express from 'express'
import { multerUploads } from '../middlewares/multer.js'
import { testingRoute, getUsers, getUser, createUser, updateUser, loginUser} from '../controllers/userControllers.js'
const userRouter = express.Router()

userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUser)

userRouter.post("/new", multerUploads.single("avatar"), createUser)
userRouter.post("/update/:id", updateUser)
userRouter.post("/login", loginUser)

export default userRouter