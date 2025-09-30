import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
    messages: [],
    users: [],  
    isUserLoading: false,
    isMessagesLoading: false,
    selectedFriend: null,

    getUser: async (email) => {
        set({ isUserLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/users/`);
            const data = await response.data;
            set({ users: data, isUserLoading: false });
        } catch (error) {
            console.error("Error fetching user:", error);
            set({ isUserLoading: false });
        }
    },

    sendMessages: async (messagesData) => {
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedFriend._id}`, messagesData);
            set({messages: [...messages, res.data]});

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    getMessages: async (email) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${email}`);
            const data = await response.data;
            set({ messages: data, isMessagesLoading: false });
        } catch (error) {
            console.error("Error fetching messages:", error);
            set({ isMessagesLoading: false });
        }
    },

    setSelectedFriend: (friend) => set({ selectedFriend: friend }),
}));