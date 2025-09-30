import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Send,
  User,
  Clock,
  PhoneCall,
  Video,
  Info,
  MicIcon,
  Plus,
  Check,
  CheckCheck
} from "lucide-react";
import { ThemeContext } from "../context/ThemContext";
import Sidebar from "./Sidebar";
import SidebarFriendsList from "./SidebarFriendsList";
import { useAuthStore } from "../store/useAuthStore";
import usericon from "/assets/userIcon.png"

function ChatSection({selectedFriend}) {
  const { authUser, checkAuth } = useAuthStore();
  const date = new Date();
  const showTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [SenderMessages, setSenderMessages] = useState([]);
  const [RecevierMessaeg, setRecevierMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSeen, setIsSeen] = useState();
  const textareaRef = useRef(null);
  const [isActive, setActiveStatus] = useState(true);
  const messagesEndRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const sendMessageSound = new Audio("/assets/notification5.mp3");

  const handleSend = () => {
    if (inputMessage.trim() !== "") {
      sendMessageSound.play();
      setSenderMessages([
        ...SenderMessages,
        {
          text: inputMessage,
          timeStamp: showTime,
          senderId: "You",
          isSeen: setIsSeen(false) // default false, when receiver sees it, set to true
        },
      ]);
      setInputMessage("");
    }
  };

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    setInputMessage(e.target.value);
    textarea.style.height = "auto"; // reset height
    textarea.style.height = textarea.scrollHeight + "px"; // set to content height
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [SenderMessages, RecevierMessaeg]);
  return (
    <>
      <div
        className={`w-full h-screen flex flex-col justify-between rounded-3xl p-3 pt-0  ${
          theme === "light" ? "bg-gray-200" : "bg-gray-800"
        }`}
      >
        {/* 🌸 User Profile Section */}
        <div
          className={`flex items-center justify-between bg-gray-100 p-2 rounded-3xl mt-0 ${
            theme === "light"
              ? "bg-gray-100 text-gray-800"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          {/* Profile Info */}
          <div className="flex items-center space-x-4 my-1">
            <img
              src={ selectedFriend?.profilePic || usericon}
              alt="User Profile"
              className="w-12 h-12 rounded-full"
            />

            <div>
              <p className="text-lg  group relative w-max cursor-pointer">
                <span>{selectedFriend?.fullName || "Unknown User"}</span>
                <span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-gray-400 group-hover:w-full"></span>
              </p>
              <span
                className={`text-sm ${
                  isActive ? "text-green-400" : "text-gray-400"
                }`}
              >
                {isActive ? "online" : "offline"}
              </span>{" "}
              {/* Green for Online, Gray for Offline */}
            </div>
          </div>

          {/* Call Buttons */}
          <div className="flex space-x-3">
            <button className="bg-gray-300 hover:bg-slate-400 p-2 rounded-full cursor-pointer">
              <PhoneCall size={20} /> {/* Call Icon */}
            </button>

            <button className="bg-gray-300 hover:bg-slate-400 p-2 rounded-full cursor-pointer">
              <Video size={20} /> {/* Video Call Icon */}
            </button>

            <button className=" hover:bg-slate-400 p-2 h-10 items-center justify-center w-10 rounded-full cursor-pointer flex flex-col gap-0.5">
              <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
              <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
              <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
            </button>
          </div>
        </div>
        {/* Messages Area */}
        <div className="flex flex-col space-y-4 overflow-auto flex-1 hide-scrollbar">
          {/* Sent Message (User → Bot) */}
          {SenderMessages.map((sendermsg, map) => (
            <div className="flex flex-col items-end">
              {/* Username + Time */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-semibold">{sendermsg.senderId}</span>
                <span>{sendermsg.timeStamp}</span>
                {isSeen ? (
                  <span className="text-blue-400 "><CheckCheck size={16} /></span>
                ) : (
                  <span className="text-gray-400"><Check size={16} /></span>
                )}
              </div>

              {/* Message Bubble */}
              <div className="bg-gray-300 p-3 rounded-3xl rounded-tr-none max-w-[660px] break-words whitespace-pre-wrap">
                {sendermsg.text}
              </div>
            </div>
          ))}

          {/* Received Message (Bot → User) */}
          {RecevierMessaeg.map((RecevierMessaeg, map) => (
            <div className="flex flex-col items-end">
              {/* Username + Time */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-semibold">Arvind</span>
                <span>10:45 AM</span>
              </div>

              {/* Message Bubble */}
              <div className="bg-gray-300 p-3 rounded-3xl rounded-tr-none max-w-[660px] break-words whitespace-pre-wrap">
                {RecevierMessaeg}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Section */}
        <div
          className={`p-3 rounded-3xl flex overflow-y-auto items-center mb-2 space-x-3 ${
            theme === "light" ? "bg-gray-100" : "bg-gray-700"
          }`}
        >
          {/* Plus Button */}
          <button className="hover:bg-slate-400 bg-gray-300 p-3 rounded-full cursor-pointer">
            <Plus size={20} />
          </button>
          {/* Input Field */}
          <textarea
            placeholder="Type a message..."
            value={inputMessage}
            onChange={handleInput}
            onKeyDown={handleKeyPress}
            className={`flex-1 p-2 rounded-3xl focus:outline-none shadow resize-y min-h-11 max-h-30 overflow-auto ${
              theme === "light" ? "bg-white" : "bg-gray-300"
            }`}
          />
          {/* Microphone Button */}
          <button className="hover:bg-slate-400 bg-gray-300 p-3 rounded-full cursor-pointer">
            <MicIcon size={20} />
          </button>
          {/* Send Button with Icon */}
          <button
            className="hover:bg-slate-400 bg-gray-300 p-3 rounded-full cursor-pointer"
            onClick={handleSend}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatSection;
