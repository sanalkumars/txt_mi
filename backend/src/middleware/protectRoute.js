import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "You are not Authorized!!!" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ message: "You are not Authorized-Invalid Token!!!" });
        }
        const user = await User.findById(decode.id).select("-password"); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("error in auth middleware", error);
        return res.status(500).json({ message: "Internal Server Error!!!" });
    }
};
