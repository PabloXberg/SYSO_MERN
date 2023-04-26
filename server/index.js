import express from "express";
const app = express();
const port = process.env.PORT || 5000;
import cors from "cors";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});