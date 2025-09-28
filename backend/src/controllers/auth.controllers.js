// import cloudinary from "../lib/cloudinary.js";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../lib/utils.js";
import User from "../models/users.models.js";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verifying Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        // If user doesn't exist, create new
        if (!user) {
            user = await User.create({
                name,
                email,
                picture,
                provider: "google",
            });
        }

        // Generate JWT
        const appToken = generateToken(user._id, res);

        // Send response
        res.status(200).json({
            success: true,
            token: appToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.picture,
            },
        });

    } catch (error) {
        console.error("Google login error:", error.message);
        res.status(400).json({
            success: false,
            message: "Google login failed",
        });
    }
};


export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (password.length < 7) {
            return res.status(400).send({ message: "password must be at least 7 characters" });
        }
        const user = await User.findOne({ email });

        if (user) return res.status(400).send({ message: "Email already exist" });

        const salt = await bcrypt.genSalt(10);

        const hashPassowrd = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassowrd
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });


        } else {
            res.status(400).json({ message: "Invalide User Data" });
        }

        console.log("New User object before save:", newUser);
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(501).json({ message: "Internal Server Error" });
    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalide Email" });

        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalide Password" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login controller ", error);
        res.status(500).json({ message: "Internal Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out Successfully" });
    } catch (error) {
        console.log("Error in logged out controller ", error);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.body._id;

        if (!profilePic) {
            res.status(400).json({ message: "profile pic is required" });
        }

        const uploadProfilePic = await cloudinary.uploader.upload(profilePic);
        const userUpdated = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json({ userUpdated });
    } catch (error) {
        console.log("error in updateController ", error);
        req.status(400).json({ message: "internal server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);

    } catch (error) {
        console.log("error in checkAuth route ", error);
        res.status(400).json({ message: "Internal server error" });
    }
}