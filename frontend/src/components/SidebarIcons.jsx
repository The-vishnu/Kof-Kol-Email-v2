import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Search,
  Settings,
  Users,
  Info,
  Cpu,
  Inbox,
  User,
  SunMoon,
  Trash,
  Archive,
  LogOutIcon,
  PenBoxIcon,
} from "lucide-react";
import { ThemeContext } from "../context/ThemContext";
import KofKol from "../assets/Kof-Kol.png";
import { useAuthStore } from "../store/useAuthStore";

function SidebarIcons({ onSelectView }) {
  const { authUser, checkAuth, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const popRef = useRef(null);
  const iconRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popRef.current &&
        !popRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popRef, iconRef]);

  return (
    <>
      {/* logo */}
      <div className="relative group mb-6 mt-1">
        <img
          src={KofKol}
          alt="Kof-Kol Logo"
          className=" w-[50px] h-[40px] cursor-pointer"
        />
      </div>
      {/* Home */}
      <div className="relative group">
        <Inbox
          size={35}
          className="cursor-pointer p-2 rounded-lg  transition-all duration-200"
        />
        <span
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Inbox
        </span>
      </div>
      {/* Trash */}
      <div className="relative group">
        <Trash
          size={35}
          className="cursor-pointer p-2 rounded-lg  transition-all duration-200"
        />
        <span
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Trash
        </span>
      </div>
      {/* Archive */}
      <div className="relative group">
        <Archive
          size={35}
          className="cursor-pointer p-2 rounded-lg  transition-all duration-200"
        />
        <span
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Archive
        </span>
      </div>
      {/* Home */}
      <div className="relative group">
        <Cpu
          size={35}
          className="cursor-pointer p-2 rounded-lg  transition-all duration-200"
        />
        <span
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          AI
        </span>
      </div>

      {/* Friends / Users */}
      <div className="relative group">
        <Users
          size={35}
          className="cursor-pointer p-2 rounded-lg  transition-all duration-200 active:scale-95" 
        />
        <span
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Friends
        </span>
      </div>

      {/* Settings */}
      <div className="relative group">
        <Settings
          ref={iconRef}
          size={35}
          className="cursor-pointer p-2 rounded-lg  transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        />
        <span
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Settings
        </span>
        <span
          ref={popRef}
          className={`${
            theme === "light" ? "bg-gray-300" : "bg-gray-500"
          } w-[300px] h-[500px] absolute left-full top-[-50px] -translate-y-1/2 ml-3 rounded-4xl px-4 py-4 ${
            isOpen ? "block" : "hidden"
          } `}
        >
          <div className="flex flex-col gap-6">
            <div className={`flex flex-row gap-2 `}>
              <User
                size={20}
                className={`${
                  theme === "light" ? "text-gray-400" : "text-gray-700"
                }`}
              />
              <p className="text-sm text-gray-400">example@gmail.com</p>
            </div>
            <div className="flex flex-row gap-2 cursor-pointer items-center">
              <SunMoon
                size={25}
                onClick={toggleTheme}
                className={`${
                  theme === "light" ? "text-gray-600" : "text-gray-700"
                }`}
              />
              <p
                className={`text-sm  ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
                onClick={toggleTheme}
              >
                {theme === "light" ? "Light Mode" : "Dark Mode "}
              </p>
            </div>

            <div
              className={`flex flex-row gap-2 cursor-pointer`}
            >
              <PenBoxIcon
                size={20}
                className={`${
                  theme === "light" ? "text-gray-600" : "text-gray-700"
                }`}
              />
              <p
                className={`text-sm  text-gray-400 ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                } `}
              >
                Update Profile
              </p>
            </div>

            <div
              className={`flex flex-row gap-2 cursor-pointer`}
              onClick={logout}
            >
              <LogOutIcon
                size={20}
                className={`${
                  theme === "light" ? "text-gray-600" : "text-gray-700"
                }`}
              />
              <p
                className={`text-sm  text-gray-400 ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                } `}
              >
                Log Out
              </p>
            </div>
          </div>
        </span>
      </div>
    </>
  );
}

export default SidebarIcons;
