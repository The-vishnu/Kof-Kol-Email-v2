import express from "express";
import { logout, signUp, login, updateProfile, checkAuth, googleLogin } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router();

// Normal signup/login
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

// Google OAuth signup/login
router.post("/google", googleLogin);



router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;