import express from 'express'
import { testingRoute, getUsers, getUser, createUser, updateUser } from '../controllers/userControllers.js'
const userRouter = express.Router()

userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUser)

userRouter.post("/new", createUser)
userRouter.post("/update/:id", updateUser)

export default userRouter