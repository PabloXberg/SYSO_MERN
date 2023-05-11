import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();

const generateToken = (existingUser) => {
  const payload = {
    sub: existingUser._id,
    username: existingUser.username,
    msg: "Normal User"
  }
  const options = {
    expiresIn: "7d",
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token
}

export { generateToken }
