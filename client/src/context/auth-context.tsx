"use client";

import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

export type User = {
  username: string;
  email: string;
  password?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

interface AuthContextType {
  user: any | null;
  admin: boolean;
  loading: boolean;
  auth: (
    url: string,
    data: { username?: string; email: string; password: string }
  ) => Promise<void>;
  adminAuth: (
    url: string,
    data: { email: string; password: string }
  ) => Promise<void>;
  logout: () => void;
  setUser: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<boolean>(false); // Initialize admin state
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const token = "123456"; // Simulated token
    const storedUser = sessionStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from sessionStorage:", error);
      }
    }

    setLoading(false);
  }, []);

  async function auth(
    url: string,
    data: { username?: string; email: string; password: string }
  ) {
    setLoading(true); // Set loading to true during auth process
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + url,
        data
      );
      console.log("res=>", res);
      toast.success(res.data.message);
      sessionStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error => ", error?.response?.data);
        toast.error(error?.response?.data?.message);
      } else {
        console.log("Error => ", error);
      }
    } finally {
      setLoading(false); // Ensure loading is false after auth process
    }
  }

  // Admin login function
  async function adminAuth(
    url: string,
    data: { email: string; password: string }
  ) {
    setLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + url,
        data
      );
      toast.success(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data);
      setAdmin(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error => ", error?.response?.data);
        toast.error(error?.response?.data?.message);
      } else {
        console.log("Error => ", error);
      }
    } finally {
      setLoading(false); // Ensure loading is false after admin login
    }
  }

  const logout = useCallback(() => {
    setLoading(true); // Set loading to true during logout
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    setUser(null);
    setAdmin(false); // Reset admin state on logout
    toast.success("You have been successfully logged out.");
    setLoading(false); // Set loading to false after logout
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, admin, loading, auth, adminAuth, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
