import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
    {
        emailID:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        fullName:{
            type:String,
            required:true,
        },
        profilePic:{
            type:String,
            default:""
        },
    },
    { timestamps : true }
);

const User = mongoose.model("User",userSchema);

export default User;