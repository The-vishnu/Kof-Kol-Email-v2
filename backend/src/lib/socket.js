import { Server } from "socket.io";
import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
const io = new Server((server), {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {};


io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log("User connected:", userId, socket.id);
    }

    //io.emit("online-users", Object.keys(userSocketMap));
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //Typing indicator handler
    socket.on("typing", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId });
        }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { senderId });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    });
});


export { io, app, server };