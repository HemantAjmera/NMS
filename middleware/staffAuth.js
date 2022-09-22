import { UnAuthenticatedError } from "../errors/index.js";
import jwt from 'jsonwebtoken'

const staffAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || ! authHeader.startsWith("Bearer")){
        throw new UnAuthenticatedError("Authentication Error")
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId, userRole: payload.userRole}
        next();
    }catch (error){
        throw new UnAuthenticatedError("Authentication Error")
    }
}