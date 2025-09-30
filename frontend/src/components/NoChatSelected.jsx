import React from "react";
import { ThemeContext } from "../context/ThemContext";
import { useContext } from "react";
import { Mail } from "lucide-react";


const NoChatSelected = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div
        className={`w-full h-screen flex flex-col justify-center items-center rounded-3xl p-3 pt-0  ${
          theme === "light" ? "bg-gray-200" : "bg-gray-800"
        }`}
      >
        <div>
            <Mail size={150} className={`m-auto mt-20 text-gray-400 animate-bounce ${theme === "light" ? "text-gray-400" : "text-gray-600"}`} />
            <p className={`text-center text-3xl text-gray-500 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>Send An Email to your Friend</p>
        </div>
      </div>
    </>
  );
};

export default NoChatSelected;
