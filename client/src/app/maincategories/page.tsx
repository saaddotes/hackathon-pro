"use client";

import axios from "axios";
import React, { useState } from "react";

export const loanCategories = [
  {
    name: "Wedding Loans",
    subcategories: ["Valima", "Furniture", "Valima Food", "Jahez"],
    maxLoan: 500000,
    loanPeriod: 3,
  },
  {
    name: "Home Construction Loans",
    subcategories: ["Structure", "Finishing", "Loan"],
    maxLoan: 1000000,
    loanPeriod: 5,
  },
  {
    name: "Business Startup Loans",
    subcategories: [
      "Buy Stall",
      "Advance Rent for Shop",
      "Shop Assets",
      "Shop Machinery",
    ],
    maxLoan: 1000000,
    loanPeriod: 5,
  },
  {
    name: "Education Loans",
    subcategories: ["University Fees", "Child Fees Loan"],
    maxLoan: "Based on requirement",
    loanPeriod: 4,
  },
];

function LoanPopup({ category, onClose }) {
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [loanPeriod, setLoanPeriod] = useState(category.loanPeriod);
  const [estimatedLoan, setEstimatedLoan] = useState(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password] = useState("tempPassword123");

  const calculateLoan = () => {
    const maxLoanAmount =
      typeof category.maxLoan === "number" ? category.maxLoan : 0;
    const loanAmount = maxLoanAmount - initialDeposit;
    const annualInstallment = loanAmount / loanPeriod;
    setEstimatedLoan({
      loanAmount,
      annualInstallment,
    });
  };

  const handleSubmit = async () => {
    try {
      const selectedLoan = {
        category: category.name,
        subcategory: selectedSubcategory,
        initialDeposit,
        loanPeriod,
        estimatedLoan,
      };

      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/register",
        {
          name,
          cnic,
          email,
          password,
          selectedLoan,
        }
      );

      if (response.status === 200) {
        alert("Registration successful, check your email!");
        onClose();
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{category.name}</h2>

        <div className="space-y-4">
          {!showDetailsForm && (
            <>
              <div>
                <label className="block mb-2 font-medium">
                  Select Subcategory
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                >
                  <option value="">Select a subcategory</option>
                  {category.subcategories.map((subcategory, index) => (
                    <option key={index} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Initial Deposit
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Loan Period (Years)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={loanPeriod}
                  onChange={(e) => setLoanPeriod(Number(e.target.value))}
                />
              </div>

              <button
                className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
                onClick={calculateLoan}
              >
                Calculate Loan
              </button>
            </>
          )}

          {estimatedLoan && !showDetailsForm && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold">Estimated Loan Breakdown</h3>
              <p>
                Loan Amount: Rs. {estimatedLoan.loanAmount.toLocaleString()}
              </p>
              <p>
                Annual Installment: Rs.{" "}
                {estimatedLoan.annualInstallment.toLocaleString()}
              </p>
              <button
                className="bg-green-500 text-white rounded-lg px-4 py-2 mt-4"
                onClick={() => setShowDetailsForm(true)}
              >
                Proceed Further
              </button>
            </div>
          )}

          {showDetailsForm && (
            <>
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">CNIC</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-lg p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
                onClick={handleSubmit}
              >
                Register and Send Email
              </button>
            </>
          )}

          <button
            className="bg-red-500 text-white rounded-lg px-4 py-2 mt-4"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MainCategories() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loanCategories.map((category, index) => (
          <div
            key={index}
            className="border rounded-2xl shadow-md hover:shadow-lg transition p-4"
          >
            <h2 className="text-xl font-bold mb-2">{category.name}</h2>
            <p className="text-gray-500 mb-2">
              Maximum Loan:{" "}
              {typeof category.maxLoan === "number"
                ? `Rs. ${category.maxLoan.toLocaleString()}`
                : category.maxLoan}
            </p>
            <p className="text-gray-600 font-medium mb-2">
              Loan Period: {category.loanPeriod} years
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              {category.subcategories.map((subcategory, subIndex) => (
                <li key={subIndex}>{subcategory}</li>
              ))}
            </ul>
            <button
              className="bg-green-500 text-white rounded-lg px-4 py-2"
              onClick={() => setActiveCategory(category)}
            >
              Proceed
            </button>
          </div>
        ))}
      </div>

      {activeCategory && (
        <LoanPopup
          category={activeCategory}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
}
