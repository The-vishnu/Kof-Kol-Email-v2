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
  CheckCheck,
  Copy,
  Pen,
} from "lucide-react";
import { ThemeContext } from "../context/ThemContext";
import Sidebar from "./Sidebar";
import TypingIndicator from "./skeletons/TypingIndicator";
import SidebarFriendsList from "./SidebarFriendsList";
import { useAuthStore } from "../store/useAuthStore";
import usericon from "/assets/userIcon.png";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

function ChatSection({ selectedFriend }) {
  const { authUser, checkAuth } = useAuthStore();
  const {
    getMessages,
    messages,
    sendMessages,
    getUser,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    onlineUsers,
    isTyping,
    setIsTyping,
    stopTyping,
  } = useChatStore();

  const date = new Date();
  const showTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [inputMessage, setInputMessage] = useState("");
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socket = useAuthStore.getState().socket;
  const messagesEndRef = useRef(null);
  const textCopyRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (selectedFriend?._id) {
      getMessages(selectedFriend._id);

      subscribeToMessages();
      console.log("fetching messages for:", selectedFriend._id);
      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [
    selectedFriend._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {

    socket.on("typing", ({ senderId }) => {
      setIsTyping(senderId);
    });

    socket.on("stopTyping", ({ senderId }) => {
      stopTyping(senderId);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [setIsTyping, stopTyping]);

  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    // notification will play when reciver send message

    const handleIncomingMessage = (messages) => {
      if (messages.receiverId === authUser._id) {
        const recieveSound = new Audio("/assets/notification3.mp3");
        recieveSound.play();
      }
    };

    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [authUser._id]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!selectedFriend) {
      toast.error("Please select a friend first!");
      return;
    }

    if (inputMessage.trim() !== "") {
      sendMessageSound.play();

      const newMessage = {
        text: inputMessage,
        timeStamp: showTime,
        senderId: authUser._id, // real logged-in user
        receiverId: selectedFriend._id,
        isSeen: false,
      };

      console.log("selectedFriend._id:", selectedFriend._id);

      await sendMessages(newMessage); // store function me API call karega
      setInputMessage("");
    }
  };

  // const handleSend = async (e) => {
  //   // e.preventDefault();

  //   try {
  //     if (inputMessage.trim() !== "") {
  //       sendMessageSound.play();
  //       await sendMessages([
  //         ...SenderMessages,
  //         {
  //           text: inputMessage,
  //           timeStamp: showTime,
  //           senderId: "You",
  //           isSeen: setIsSeen(false), // default false, when receiver sees it, set to true
  //         },
  //       ]);
  //       setInputMessage("");
  //     }
  //   } catch (error) {
  //     console.log("failed to send messages: ", error);
  //     toast.error("failed to sent message");
  //   }
  // };
  const sendMessageSound = new Audio("/assets/notification5.mp3");

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    setInputMessage(e.target.value);
    textarea.style.height = "auto"; // reset height
    textarea.style.height = textarea.scrollHeight + "px"; // set to content height

    // Typing indicator logic
    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedFriend._id,
    });

    // Clear old timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedFriend._id,
      });
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(e);
    }
  };

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
              src={selectedFriend?.profilePic || usericon}
              alt="User Profile"
              className="w-12 h-12 rounded-full"
            />

            <div>
              <p className="text-lg  group relative w-max cursor-pointer">
                <span>{selectedFriend?.fullName || "Unknown User"}</span>
                <span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-gray-400 group-hover:w-full"></span>
              </p>

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

        <div className="flex flex-col space-y-4 w-full overflow-auto flex-1 hide-scrollbar p-1.5">
          {messages.map((msg, index) => {
            const isSender = msg.senderId === authUser._id; // logged-in user ke messages right side
            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isSender ? "items-end" : "items-start"
                }`}
              >
                {/* Username + Time */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-semibold">
                    {isSender ? "You" : selectedFriend.fullName}
                  </span>
                  <span>
                    {msg.timeStamp ||
                      new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>

                  {/* ✅ Only sender ke liye ticks */}
                  {isSender &&
                    (msg.isSeen ? (
                      <CheckCheck size={16} className="text-blue-400" />
                    ) : (
                      <Check size={16} className="text-gray-400" />
                    ))}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-3xl max-w-[660px] break-words whitespace-pre-wrap ${
                    isSender
                      ? "bg-gray-300 rounded-tr-[3px]" // sender → right
                      : "bg-gray-300 rounded-tl-[3px]" // receiver → left
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`w-6 h-3 flex flex-row gap-2 ml-1 justify-center`}
                >
                  <span>
                    <Copy
                      size={14}
                      className="text-gray-400 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(msg.text);
                        toast.success("Text copied to clipboard!");
                      }}
                    />
                  </span>
                  <span>
                    <Pen
                      size={14}
                      className="text-gray-400 cursor-pointer"
                      onClick={() => {}}
                    />
                  </span>
                </div>
              </div>
            );
          })}
          <div>
            {isTyping[selectedFriend._id] && (
              <span className="text-gray-400 animate-pulse">typing...</span>
            )}
          </div>
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
            ref={textareaRef}
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
