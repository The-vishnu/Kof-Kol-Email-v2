import User from "../models/users.models.js";
import { v2 as cloudinary } from "cloudinary";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -_id -__v -createdAt -updatedAt -email");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessagesBetweenUsers = async (req, res) => {
    // Implementation will go here
    try {
        const { id:userToChatId } = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        })
    } catch (error) {
        console.error("Error fetching messages between users:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image, } = req.body;
        const senderId = req.user._id;
        const { id: receiverId } = req.params;

        let imageUrl;

        // if(image){
        //     const uploadResponse = await cloudinary.uploader.upload(image)
        //     imageUrl = uploadResponse.secure_url;
        // }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        // Emit the message via Socket.io
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}