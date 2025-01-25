"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";

export default function LoanUser() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [isAddingDetails, setIsAddingDetails] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [additionalDetails, setAdditionalDetails] = useState<string>("");

  // Fetch loan requests
  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user-loan-request?userId=${user?._id}`
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

    if (user?._id) {
      fetchLoanRequests();
    }
  }, [user]);

  const handleAddDetailsClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsAddingDetails(true);
  };

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [guarantors, setGuarantors] = useState([
    { name: "", email: "", location: "", cnic: "" },
    { name: "", email: "", location: "", cnic: "" },
  ]);
  const [personalInfo, setPersonalInfo] = useState({ address: "", phone: "" });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!additionalDetails.trim()) {
      setError("Please enter additional details.");
      return;
    }

    setLoading(true);

    try {
      // Send request to update the loan request with additional details
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update-loan-request/${selectedRequestId}`,
        {
          additionalDetails,
        }
      );

      if (response.data.success) {
        setIsAddingDetails(false);
        setAdditionalDetails("");
        setSelectedRequestId(null);
        // Update loan requests with the new data
        setLoanRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === selectedRequestId
              ? { ...request, additionalDetails }
              : request
          )
        );
      } else {
        setError("Failed to add details.");
      }
    } catch (err) {
      setError("An error occurred while adding details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuarantorChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedGuarantors = [...guarantors];
    updatedGuarantors[index][field] = value;
    setGuarantors(updatedGuarantors);
  };

  // Handle Personal Info Input
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Submit Data to the Backend
  const submitData = async () => {
    setLoading(true);
    setError(""); // Reset error state

    const userId = user?._id; // Ensure this is correctly set
    const formData = {
      email: user?.email,
      password: user?.password || "", // Include password if needed
      userId: userId,
      guarantors: guarantors,
      personalInfo: personalInfo,
      status: "pending", // Default status
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user-loan`, // Ensure correct endpoint
        formData
      );

      const data = response.data;

      if (!data.success) {
        setError(data.message); // Handle failure message
      } else {
        console.log("Loan request submitted:", data);
        // Handle success (maybe store token or navigate)
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Select a loan request to edit details
  const handleSelectLoanRequest = (request: any) => {
    setSelectedRequestId(request._id); // Changed from setSelectedLoanRequest
    setGuarantors(
      request.guarantors || [
        { name: "", email: "", location: "", cnic: "" },
        { name: "", email: "", location: "", cnic: "" },
      ]
    );
    setPersonalInfo(request.personalInfo || { address: "", phone: "" });
  };

  return (
    <div>
      <h1>User Loan Requests</h1>

      {/* Show error if fetching failed */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Schedule Date</th>
            <th>Schedule Time</th>
            <th>Office Location</th>
            <th>Guarantor Names</th>
            <th>Guarantor Emails</th>
            <th>Guarantor CNIC</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loanRequests.length > 0 ? (
            loanRequests.map((request, index) => (
              <tr key={index}>
                <td>{new Date(request.schedule.date).toLocaleDateString()}</td>
                <td>{request.schedule.time}</td>
                <td>{request.schedule.officeLocation}</td>

                {/* Guarantors Information */}
                <td>
                  {request.guarantors.map((guarantor: any, idx: number) => (
                    <div key={idx}>{guarantor.name}</div>
                  ))}
                </td>

                <td>
                  {request.guarantors.map((guarantor: any, idx: number) => (
                    <div key={idx}>{guarantor.email}</div>
                  ))}
                </td>

                <td>
                  {request.guarantors.map((guarantor: any, idx: number) => (
                    <div key={idx}>{guarantor.cnic}</div>
                  ))}
                </td>

                <td>{request.status}</td>

                <td>
                  {/* Show Add More Details button if status is pending */}
                  {request.status === "pending" && (
                    <button onClick={() => handleAddDetailsClick(request._id)}>
                      Add More Details
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No loan requests found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form to add details */}
      {isAddingDetails && (
        <div>
          <h2>Add More Details</h2>
          <form onSubmit={handleFormSubmit}>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Enter additional details here..."
              rows={4}
              style={{ width: "100%" }}
            />
            {/* Guarantors' Information */}
            <h2>Guarantors' Details</h2>
            {guarantors.map((guarantor, index) => (
              <div key={index}>
                <h3>Guarantor {index + 1}</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={guarantor.name}
                  onChange={(e) =>
                    handleGuarantorChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={guarantor.email}
                  onChange={(e) =>
                    handleGuarantorChange(index, "email", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={guarantor.location}
                  onChange={(e) =>
                    handleGuarantorChange(index, "location", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="CNIC"
                  value={guarantor.cnic}
                  onChange={(e) =>
                    handleGuarantorChange(index, "cnic", e.target.value)
                  }
                />
              </div>
            ))}

            {/* Personal Information */}
            <h2>Personal Information</h2>
            <input
              type="text"
              placeholder="Address"
              value={personalInfo.address}
              onChange={(e) =>
                handlePersonalInfoChange("address", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={personalInfo.phone}
              onChange={(e) =>
                handlePersonalInfoChange("phone", e.target.value)
              }
            />

            {/* Submit Button */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <button onClick={submitData}>Submit Loan Request</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
