import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Set the token as a cookie
    res.cookie("jwt", token, {
        // maxAge: 7 * 24 * 60 * 60 * 1000,
        maxAge: 6 * 60 * 60 * 1000 ,// equals 21,600,000 ms (6 hours) 
        httpOnly: true,                 
        sameSite: true,              
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};
