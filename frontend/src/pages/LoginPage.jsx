import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import KofKol from "../assets/Kof-Kol.png";
import { EyeIcon, EyeOff, MailCheck, Loader } from "lucide-react"; // EyeOff = closed eye
import { useAuthStore } from "../store/useAuthStore";
import google from "/assets/google.png";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLogging } = useAuthStore();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen ml-[30px] bg-gray-300">
      <div className="flex gap-1 justify-center items-center min-h-screen w-[600px] h-96 bg-gray-300">
        <div className="flex flex-col justify-center items-center mb-[90px] gap-1 text-2xl font-semibold text-gray-700">
          <img
            src={KofKol}
            alt="Kof-Kol Logo"
            className=" w-[550px] h-[500px]"
          />
          <span className="">Access Your Kof-Kol Hub 🔑</span>
        </div>
      </div>

      <div className="w-[500px] bg-gray-200 shadow-lg rounded-3xl overflow-hidden">
        {/* Form body */}
        <form action="" method="get" onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-1 text-gray-600 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10"
              />
              {showPassword ? (
                <EyeIcon
                  className="absolute right-3 top-[50px] -translate-y-1/2 text-gray-500 cursor-pointer"
                  size={20}
                  onClick={handleShowPassword}
                />
              ) : (
                <EyeOff
                  className="absolute right-3 top-[50px] -translate-y-1/2 text-gray-500 cursor-pointer"
                  size={20}
                  onClick={handleShowPassword}
                />
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full cursor-pointer inset-y-0 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {isLogging ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </button>
            <p className="ml-55 mt-[-20px] mb-[-20px]"> or </p>
            <button
              type="submit"
              className="w-full bg-gray-100 text-black flex flex-row gap-1.5 py-3 rounded-xl font-semibold hover:opacity-90 cursor-pointer transition text-center items-center justify-center"
              disabled={isLogging}
            >
              <img src={google} alt="" className="w-5 h-5" />
              login with Google
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
