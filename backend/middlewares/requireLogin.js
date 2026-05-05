import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/model.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).json({
                error: "You must have logged in"
            })
        }
        // res.json({message: "ok"});
        const token = authorization.replace("Bearer ","")

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode._id).select("-password"); // Except password all details 
        if(!user){
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user;
        // console.log(user);
        next()
    } catch (error) {
        console.log("Auth error: ", error);
        return res.status(401).json({error: "Invalid or Expired Token"});
    }
}

export default authMiddleware;      