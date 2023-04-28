import express from 'express'
import { testingRoute, getUsers, getUser } from '../controllers/userControllers.js'
const userRouter = express.Router()

userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUser)

export default userRouter