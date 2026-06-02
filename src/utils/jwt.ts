import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const generateToken = (payload: {
    userId:string,
    email:string,
    role:string
}) => {
    return jwt.sign(payload, config.jwt_secret, {
        expiresIn: config.jwt_expires_in as any,
    }); 
}
