import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";

//protect middleware
const protect = asyncHandler(async (req, res, next) => {
    //reading the jwt token from the cookie of the request
    let token = req.cookies.jwt;
    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password"); //sending the authorized user object through the request without the password field because we'll not use it!
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not authorized! Token failed.")
        }

    } else {
        res.status(401);
        throw new Error("Not authorized! No token.")
    }
})

const admin = asyncHandler((req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401);
        throw new Error("Not authorized as admin.");
    }
} )

export {protect, admin};



