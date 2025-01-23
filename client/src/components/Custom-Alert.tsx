import React, { useState } from "react";

const CustomAlert = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div
      role="alert"
      className="alert alert-error fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info h-6 w-6 shrink-0 inline-block mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{message}</span>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-sm mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-sm btn-primary" onClick={onConfirm}>
            Confrim
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
