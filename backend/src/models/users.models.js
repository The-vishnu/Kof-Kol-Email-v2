import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    password: {
      type: String,
      minlength: 7,
      required: function () {
        return this.provider === "local";
      },
      default: null,
    },
    profilePic: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId: {
      type: String, 
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
