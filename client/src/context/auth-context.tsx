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
  admin: boolean | string;
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
  const [admin, setAdmin] = useState<boolean | string>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedAdmin = sessionStorage.getItem("admin");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setAdmin(storedAdmin);
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
    setLoading(true);
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
      setLoading(false);
    }
  }

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
      sessionStorage.setItem("user", JSON.stringify(res.data.data));
      sessionStorage.setItem("admin", "true");
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
      setLoading(false);
    }
  }

  const logout = useCallback(() => {
    setLoading(true);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    setUser(null);
    setAdmin(false);
    toast.success("You have been successfully logged out.");
    setLoading(false);
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
