"use client";

import React, { useState } from "react";
import LoanPopup from "@/components/LoanPopup";

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

export default function MainCategories() {
  const [activeCategory, setActiveCategory] = useState<any>(null);

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
