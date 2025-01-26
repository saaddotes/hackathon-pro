import axios from "axios";
import React, { useState } from "react";

interface Guarantor {
  name: string;
  email: string;
  location: string;
  cnic: string;
}

interface PersonalInfo {
  address: string;
  phone: string;
}

interface LoanDetailsFormProps {
  isAddingDetails: boolean;
  setIsAddingDetails: (value: boolean) => void;
  userId: string;
}

const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({
  isAddingDetails,
  setIsAddingDetails,
  userId,
}) => {
  const [guarantors, setGuarantors] = useState<Guarantor[]>([
    { name: "", email: "", location: "", cnic: "" },
    { name: "", email: "", location: "", cnic: "" },
  ]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    address: "",
    phone: "",
  });

  const handleGuarantorChange = (
    index: number,
    field: keyof Guarantor,
    value: string
  ) => {
    const updatedGuarantors = [...guarantors];
    updatedGuarantors[index][field] = value;
    setGuarantors(updatedGuarantors);
  };

  const handlePersonalInfoChange = (
    field: keyof PersonalInfo,
    value: string
  ) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const submitData = async () => {
    const formData = {
      userId,
      guarantors,
      personalInfo,
      status: "pending",
    };

    try {
      const response = await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/user-loan",
        formData
      );

      const data = response.data;

      console.log(data);
      if (!data.success) {
        console.error(data.message);
      } else {
        console.log("Loan request submitted:", data);
        setIsAddingDetails(false); // Close the modal after successful submission
      }
    } catch (error) {
      console.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return isAddingDetails ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="modal-box w-11/12 max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Add More Details</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <h3 className="text-lg font-bold mb-2">Guarantors' Details</h3>
          {guarantors.map((guarantor, index) => (
            <div key={index} className="space-y-2 mb-4">
              <h4 className="font-semibold">Guarantor {index + 1}</h4>
              <input
                type="text"
                placeholder="Name"
                value={guarantor.name}
                onChange={(e) =>
                  handleGuarantorChange(index, "name", e.target.value)
                }
                className="input input-bordered w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={guarantor.email}
                onChange={(e) =>
                  handleGuarantorChange(index, "email", e.target.value)
                }
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Location"
                value={guarantor.location}
                onChange={(e) =>
                  handleGuarantorChange(index, "location", e.target.value)
                }
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="CNIC"
                value={guarantor.cnic}
                onChange={(e) =>
                  handleGuarantorChange(index, "cnic", e.target.value)
                }
                className="input input-bordered w-full"
              />
            </div>
          ))}

          <h3 className="text-lg font-bold mb-2">Personal Information</h3>
          <input
            type="text"
            placeholder="Address"
            value={personalInfo.address}
            onChange={(e) =>
              handlePersonalInfoChange("address", e.target.value)
            }
            className="input input-bordered w-full"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            className="input input-bordered w-full"
          />

          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={() => setIsAddingDetails(false)} className="btn">
              Cancel
            </button>
            <button
              type="button"
              onClick={submitData}
              className="btn btn-primary"
            >
              Submit Loan Request
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default LoanDetailsForm;
