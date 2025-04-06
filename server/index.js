// import express from "express";
// import mongoose from "mongoose";
// import * as dotenv from "dotenv";
// dotenv.config();
// import userRouter from "./routes/userRoutes.js";
// import sketchRouter from "./routes/sketchRoutes.js";
// import cloudinaryConfig from "./config/cloudinary.js";
// import cors from "cors";
// import passportConfig from "./config/passport.js";
//import sketchRouter from "./routes/sketchRoutes.js";
// import commentRouter from "./routes/commentsRoutes.js";


// const app = express();
// const port = process.env.PORT || 5000;

// const setMiddlewares = () => {
//   app.use(express.json());
//   app.use(
//   express.urlencoded({
//     extended: true,
//   })
//   );
//   app.use(cors());
//   cloudinaryConfig();
//   passportConfig();
// }

// const connectMongoose = () => {
//   mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(port, () => {
//       console.log("Connection to MongoDB established, and server is running on port " + port);
//     });
//   })
//   .catch((err) => console.log(err));
// }

// const connectRoutes = () => {
//   app.use("/api/users", userRouter);
//   app.use("/api/sketches", sketchRouter);
//   app.use("/api/comments", commentRouter);
//   app.use("*", (req,res) => {res.status(500).json({error: "Endpoint not found - What for a API is that!?!?!"})})
// }


// setMiddlewares();
// connectMongoose();
// connectRoutes();

import sketchRouter from "./routes/sketchRoutes.js";
import commentRouter from "./routes/commentsRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cloudinaryConfig from "./config/cloudinary.js";
import * as dotenv from "dotenv";
dotenv.config();

import userRouter from './routes/userRoutes.js'

import cors from "cors";
import passportConfig from "./config/passport.js";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 4000;


app.use(cors({
    origin: process.env.FRONTEND_URL || "https://shareyoursketch.com",
    credentials: true
}));

// app.listen(3000, () => {
//     console.log("Servidor corriendo en el puerto 3000");
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

const setMiddlewares = () => {
  
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true, }));
  app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cors());
  cloudinaryConfig();
  passportConfig();
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
   app.use("/api/comments", commentRouter);
  app.use('*', (req, res) => { res.status(500).json({ error: "Endpoint not found" }) });
}

setMiddlewares();
connectMongoose();
connectRoutes();
