import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/userRoutes.js";
import sketchRouter from "./routes/sketchRoutes.js";

import cors from "cors";


const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connection to MongoDB established, and server is running on port " + port);
    });
  })
  .catch((err) => console.log(err));

// app.listen(port, () => {
//   console.log("Server is running on port: " + port);
// });

app.use("/api/users", userRouter);
app.use("/api/sketches", sketchRouter);

// const helloFunction = (req, res) => {
//   res.send({message: 'Hallo Pablo!!!', example: [1, 2, 3, 4, 5]})
// }

 
// app.get('/test', (req, res) => {
//   res.send({message: 'Hallo Pablo!!!', example: [1, 2, 3, 4, 5]})
// });