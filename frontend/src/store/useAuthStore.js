import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) =>({
    authUser: null,
    isSigningUp: false,
    isLogging: false,
    isAuthChecking: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get(`/auth/check`);
            const data = await res.data;
            console.log("Auth checking response:", data);
            set({ authUser: data });
        } catch (error) {
            console.log("Auth check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isAuthChecking: false });
        }
    },
    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post(`/auth/signup`, data);
            const user = await res.data;
            set({ authUser: user });
            toast.success("Sign up successful!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign up failed. Please try again.");
            console.log("Sign up failed:", error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login : async (data) => {
        set({ isLogging: true });
        try {
            const res = await axiosInstance.post(`/auth/login`, data);
            const user = await res.data;
            set({ authUser: user });
            toast.success("Login successful!");
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
            toast.success("Logged out successfully.");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.log("Logout failed:", error);
        } finally {
            set({ isLogging: false });
        }
    },

}));

