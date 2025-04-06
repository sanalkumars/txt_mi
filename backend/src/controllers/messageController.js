import cloudinary from "../lib/cloudinary.js";
import { getReciverSocketId, io } from "../lib/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";



export const getUsers = async(req , res)=>{
    try {
        const loggedInUserId = req.user._id;
        //the $ne => filtering the users using the their id which are not equal to the logged id
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("error", error.message);
        res.status(500).json({message:"Internal Server Error!!!!"});
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id :usertochatId } = req.params;
        if (!usertochatId) {
            return res.status(400).json({message:"User Not Found"});
        }
        const senderId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:senderId,reciverId:usertochatId},
                {senderId:usertochatId,reciverId:senderId}
            ]
        });
        res.status(200).json(messages);

    } catch (error) {
        console.log("error occured is =>",error.message);
        res.status(500).json({error:"Internal Server Error!!!!"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text , imagePreview } = req.body;
       
        const{ id :reciverId } = req.params;
        const senderId = req.user._id; 

        let imageUrl;

        if (imagePreview) { 
            // uploading the image to the cloudinary (secure_url contains the url for the uploaded image)
            const uploadResponse = await cloudinary.uploader.upload(imagePreview);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage = await Message({
            senderId,
            reciverId,
            text,
            image:imageUrl
        });
console.log("reciverid ",reciverId);
        await newMessage.save();
// below code part is for sending real time data to the reciver if they are online
        const reciverSocketId = getReciverSocketId(reciverId)
        console.log("1",reciverSocketId);
        if (reciverSocketId) {
            // reason for using to() method here is to make sure that the reciverid whose given here only get the message , since the emit((broadcast)send message to all online users)
            io.to(reciverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("error occured is :",error);
        res.status(500).json({error:"Internal Server Error!!!!"});
    }
}