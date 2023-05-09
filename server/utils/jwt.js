import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();

const generateToken = (existingUser) => {

    const payload = {
        sub: existingUser._id,
        msg: "MADAFAKAS"
    }
    
    const option = {
        expiresIn: "7d",
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, option); {
        return token
        
    };
}

export {generateToken}