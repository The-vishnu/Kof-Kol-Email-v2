import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/Kof-Kol");
        console.log(`MongoDB is connected successfully`);
        
    } catch (error) {
        console.log(`Something went wrong ${error}`);
        
    }
}