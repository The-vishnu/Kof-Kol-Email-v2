import User from "../models/users.models.js";
import { v2 as cloudinary } from "cloudinary";
import Message from "../models/message.model.js";
import Conversation from "../models/converation.model.js";
import mongoose, { get } from "mongoose";
import { getReceiverSocketId } from "../lib/socket.js"
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v -createdAt -updatedAt");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessagesBetweenUsers = async (req, res) => {
    // Implementation will go here
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages between users:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image, } = req.body;
        const senderId = req.user?._id;
        console.log("req.user:", req.user);
        if (!senderId) return res.status(400).json({ message: "Sender not authenticated" });

        // const receiverId = req.params.id;

        const receiver = await User.findOne({ _id: req.params.id });
        if (!receiver) return res.status(404).json({ message: "User not found" });

        let imageUrl;

        // if(image){
        //     const uploadResponse = await cloudinary.uploader.upload(image)
        //     imageUrl = uploadResponse.secure_url;
        // }

        let conversation = await Conversation.findOne({
            members: { $all: [senderId, receiver._id] }
        });

        if (!conversation) {
            conversation = new Conversation({
                members: [senderId, receiver._id]
            });
            await conversation.save();
        }


        const newMessage = new Message({
            senderId,
            receiverId: receiver._id,
            text,
            image: imageUrl || null,
            conversationId: conversation._id,

        });

        await newMessage.save();
        // Emit the message via Socket.io
        const receiverSocketId = getReceiverSocketId(receiver._id);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}