import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLogging: false,
    isAuthChecking: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get(`/auth/check`);
            const data = await res.data;
            console.log("Auth checking response:", data);
            set({ authUser: data });
            get().connectSocket();
        } catch (error) {
            console.log("Auth check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isAuthChecking: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();

        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: { userId: authUser._id },
            withCredentials: true,
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (usersIds) => {
            set({ onlineUsers: usersIds });
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post(`/auth/signup`, data);
            const user = await res.data;
            set({ authUser: user });
            toast.success("Sign up successful!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign up failed. Please try again.");
            console.log("Sign up failed:", error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLogging: true });
        try {
            const res = await axiosInstance.post(`/auth/login`, data);
            const user = await res.data;
            set({ authUser: user });
            toast.success("Login successful!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
            console.log("Login failed:", error);
        } finally {
            set({ isLogging: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post(`/auth/logout`);
            set({ authUser: null });
            get().disconnectSocket();
            toast.success("Logged out successfully.");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.log("Logout failed:", error);
        } finally {
            set({ isLogging: false });
        }
    },

}));

