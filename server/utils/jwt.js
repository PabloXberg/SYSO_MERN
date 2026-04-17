import jwt from "jsonwebtoken";

// Note: dotenv.config() runs once in index.js — no need to repeat here.

const generateToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.username,
  };
  const options = {
    expiresIn: "7d",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export { generateToken };
