import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/userRoutes.js";
import sketchRouter from "./routes/sketchRoutes.js";
import cloudinaryConfig from "./config/cloudinary.js";
import cors from "cors";


const app = express();
const port = process.env.PORT || 5000;

const setMiddlewares = () => {
  app.use(express.json());
  app.use(
  express.urlencoded({
    extended: true,
  })
  );
  app.use(cors());
  cloudinaryConfig();
}

const connectMongoose = () => {
  mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connection to MongoDB established, and server is running on port " + port);
    });
  })
  .catch((err) => console.log(err));
}

const connectRoutes = () => {
  app.use("/api/users", userRouter);
  app.use("/api/sketches", sketchRouter);
  app.use("*", (req,res) => {res.status(500).json({error: "Endpoint not found - What for a API is that!?!?!"})})
}


setMiddlewares();
connectMongoose();
connectRoutes();