"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminDashboard from "@/components/AdminDashboard";
import { useRouter } from "next/navigation";

export default function Admin() {
  const { admin, adminAuth, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      await adminAuth("/auth/login", { email, password });
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (admin) {
      const fetchLoanRequests = async () => {
        setLoadingRequests(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/loanrequests`
          );
          setLoanRequests(response.data.data);
        } catch (error) {
          setError("Failed to fetch loan requests. Please try again." + error);
        } finally {
          setLoadingRequests(false);
        }
      };

      fetchLoanRequests();
    }

    if (!user || !admin) {
      router.push("/auth");
    }
  }, [admin]);

  if (!user || !admin) {
    return <div>Loading...</div>;
  }

  return (
    <AdminDashboard
      loanRequests={loanRequests}
      loadingRequests={loadingRequests}
      setModalData={setModalData}
      modalData={modalData}
    />
  );
}
