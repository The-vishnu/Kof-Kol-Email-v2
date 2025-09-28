import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessagesBetweenUsers, getUsersForSidebar, sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessagesBetweenUsers);

router.post("/send/:id", protectRoute, sendMessage);
export default router;