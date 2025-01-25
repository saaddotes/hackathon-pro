"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import LoanRequestTable from "@/components/LoanRequestTable";
import LoanDetailsForm from "@/components/LoanDetailsForm";
import { useRouter } from "next/navigation";

export default function LoanUser() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [isAddingDetails, setIsAddingDetails] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            "/auth/user-loan-request" +
            "?userId=" +
            user?.email
        );
        const data = response.data;

        if (data.success) {
          setLoanRequests(data.data);
        } else {
          setError("Failed to fetch loan requests");
        }
      } catch (err) {
        setError("An error occurred while fetching loan requests");
        console.error(err);
      }
    };

    if (!user) {
      router.push("/auth");
    }

    if (user?._id) {
      fetchLoanRequests();
    }
  }, [user]);

  const handleAddDetailsClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsAddingDetails(true);
  };

  if (!user) return <h1>Loading</h1>;

  return (
    <div>
      <h1>User Loan Requests</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <LoanRequestTable
        loanRequests={loanRequests}
        onAddDetails={handleAddDetailsClick}
      />

      <LoanDetailsForm
        isAddingDetails={isAddingDetails}
        setIsAddingDetails={setIsAddingDetails}
        userId={user._id}
      />
    </div>
  );
}
