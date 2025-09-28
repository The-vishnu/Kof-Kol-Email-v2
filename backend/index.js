import express from "express";
import dotenv from "dotenv";
import authRouts from "./src/routes/auth.route.js"
import messageRoutes from "./src/routes/message.route.js"
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
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
  res.send("Welcome to the Dragon Chat App 🐉");
});

app.use("/api/auth", authRouts);
app.use("/api/message", messageRoutes);
// Start Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectDB();
});
