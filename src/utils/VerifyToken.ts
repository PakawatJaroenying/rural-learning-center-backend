import jwt  from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";


export function verifyToken(token: string): JwtPayload | null {
    if(!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}