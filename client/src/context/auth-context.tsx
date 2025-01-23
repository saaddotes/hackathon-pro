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
  user: User | null;
  auth: (
    url: string,
    data: { username?: string; email: string; password: string }
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // const token = sessionStorage.getItem("authToken");
    const token = "123456";
    const storedUser = sessionStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from sessionStorage:", error);
      }
    }
  }, []);

  async function auth(url: string, data: any) {
    console.log("url => ", url, data);
    try {
      const res = await axios.post(url, data);
      console.log("res=>", res.data);
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
    }
  }

  const logout = useCallback(() => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    setUser(null);
    toast.success("You have been successfully logged out.");
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth, logout }}>
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
