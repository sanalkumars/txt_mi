import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"

export const SignUp = async (req, res) => {
    const { fullName, emailID, password } = req.body;
    try {

        if (!emailID || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required!!!!!!!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Weak Password , Password should be atleast six characters" });
        }

        const user = await User.findOne({ emailID });

        if (user) {
            return res.status(400).json({ message: "User Already Exists!!!!!!" });
        }
        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            emailID,
            password: hashedPassword,
        });

        if (newUser) {
            // generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.emailID,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        res.status(500).json({ message: "Sorry Some Error Occured cannot process your request now!!!!" })
        console.log("error occured :", error);
    }
}


export const Login = async (req, res) => {
    try {
        const { emailID, password } = req.body;

        if (!emailID || !password) {
            return res.status(400).json({ message: "All fields are required!!!!!!!" });
        }

        const user = await User.findOne({ emailID });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credential" });
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(400).json({ message: "Invalid Credential" });
        }

        generateToken(user._id, res);

        return res.status(200).json({
            message: "Login Successful",
            data: {
                _id: user._id,
                fullName: user.fullName,
                emailID: user.emailID,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Internal Server Error!!!" });
    }
};



export const Logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logout Successfull" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!!!" });
    }
}

export const updateProfile = async (req, res) => {
    try {
       
        const { profilePic } = req.body;

        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required!!!!" });
        }

        // Check if userId is valid ObjectId format
        // if (!mongoose.Types.ObjectId.isValid(userId)) {
        //     return res.status(400).json({ message: "Invalid user ID format" });
        // }

   

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

      

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        return res.status(200).json({ message: "Profile Picture Updated Successfully", updateUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!!!!" });

    }
}

export const CheckUser = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkauth controller", error.message);
        res.status(500).json({ message: "Internal Server Error!!!" });
    }
};
