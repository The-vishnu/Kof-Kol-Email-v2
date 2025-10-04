import express from "express";
import dotenv from "dotenv";
import authRouts from "./src/routes/auth.route.js"
import messageRoutes from "./src/routes/message.route.js"
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { io, server, app } from "./src/lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Middleware to parse JSON request body
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to Kof-Kol 🐉");
});

app.use("/api/auth", authRouts);
app.use("/api/messages", messageRoutes);
// Start Server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectDB();
});
