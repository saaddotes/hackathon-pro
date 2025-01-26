"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import LoanRequestTable from "@/components/LoanRequestTable";
import LoanDetailsForm from "@/components/LoanDetailsForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoanUser() {
  const { user, setUser } = useAuth();
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [isAddingDetails, setIsAddingDetails] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
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

        console.log(data);

        if (data.success) {
          setLoanRequests(data.data);
        } else {
          toast.error("Failed to fetch loan requests");
        }
      } catch (err) {
        toast.error("An error occurred while fetching loan requests");
        console.error(err);
      }
    };

    if (!user) {
      router.push("/auth");
    }

    // if (user?.isNew) {
    //   setIsPasswordModalOpen(true); // Open modal if user is new
    // }

    if (user?._id) {
      fetchLoanRequests();
    }
  }, [user, router]);

  const updatePassword = async () => {
    if (newPassword.trim().length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    console.log(user);

    try {
      console.log(user);
      const response = await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/update-password",
        {
          userId: user?._id,
          password: newPassword,
        }
      );

      console.log(response);

      if (response.status == 200) {
        toast.success("Password updated successfully. Please log in again.");
        setUser({ ...user, isNew: false });
        setIsPasswordModalOpen(false);
        router.push("/auth"); // Redirect to login after updating the password
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred while updating the password.");
      console.error(err);
    }
  };

  const handleAddDetailsClick = (requestId: string) => {
    setIsAddingDetails(true);
    console.log(requestId);
  };

  if (!user) return <h1>Loading...</h1>;

  return (
    <div>
      <LoanRequestTable
        loanRequests={loanRequests}
        onAddDetails={handleAddDetailsClick}
      />

      <LoanDetailsForm
        isAddingDetails={isAddingDetails}
        setIsAddingDetails={setIsAddingDetails}
        userId={user._id}
      />

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Update Password</h2>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={updatePassword}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
