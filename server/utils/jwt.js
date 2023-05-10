import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();

const generateToken = (existingUser) => {

    const payload = {
        email: existingUser.email,
        avatar: existingUser.avatar,
        msg: "Normal User"
    }
    
    const options = {
        expiresIn: "30d",
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, options); {
        return token
        
    };
}

export {generateToken}