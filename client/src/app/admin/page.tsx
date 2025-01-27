"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import AdminDashboard from "@/components/AdminDashboard";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Admin() {
  const { admin, user } = useAuth();
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any | null>(null);

  const router = useRouter();
  useEffect(() => {
    if (admin) {
      const fetchLoanRequests = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/loanrequests`
          );
          setLoanRequests(response.data.data);
        } catch (error) {
          toast.error(
            "Failed to fetch loan requests. Please try again." + error
          );
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
      setModalData={setModalData}
      modalData={modalData}
    />
  );
}
