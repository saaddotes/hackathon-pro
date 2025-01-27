import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react"; // Use QRCodeSVG for SVG-based QR codes

interface LoanRequest {
  _id: string;
  schedule: { date: string; time: string; officeLocation: string };
  guarantors: { name: string; email: string; cnic: string }[];
  status: string;
  selectedLoan: any;
}

interface LoanRequestTableProps {
  loanRequests: LoanRequest[];
  onAddDetails: (requestId: string) => void;
}

const LoanRequestTable: React.FC<LoanRequestTableProps> = ({
  loanRequests,
  onAddDetails,
}) => {
  const [tokens, setTokens] = useState<{ [key: string]: string }>({});

  // Function to generate a token for a particular loan request
  const generateToken = (requestId: string) => {
    const newToken = `Token-${requestId}`;
    setTokens((prevTokens) => ({ ...prevTokens, [requestId]: newToken }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-sm table-zebra">
        <thead className="bg-primary text-white">
          <tr>
            <th>Loan Request</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Loan Amount</th>
            <th>Installment</th>
            <th>Loan Period</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loanRequests.length > 0 ? (
            loanRequests.map((request) => (
              <tr key={request._id} className="hover:bg-base-200">
                <td>{request._id}</td>
                <td>{request?.selectedLoan?.category}</td>
                <td>{request?.selectedLoan?.subcategory}</td>
                <td>{request?.selectedLoan?.estimatedLoan.loanAmount}</td>
                <td>
                  {request?.selectedLoan?.estimatedLoan.annualInstallment}
                </td>
                <td>{request?.selectedLoan?.loanPeriod}</td>
                <td>
                  <span
                    className={`badge ${
                      request.status === "pending"
                        ? "badge-warning"
                        : "badge-success text-white"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.status === "pending" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onAddDetails(request._id)}
                    >
                      Add More Details
                    </button>
                  )}

                  {/* Generate Token and QR Code if status is "approved" */}
                  {request.status === "approved" && !tokens[request._id] && (
                    <button
                      className="btn btn-secondary btn-sm mt-2"
                      onClick={() => generateToken(request._id)}
                    >
                      Generate Token & QR Code
                    </button>
                  )}

                  {tokens[request._id] && (
                    <div className="mt-2">
                      <p className="text-lg font-semibold">Generated Token:</p>
                      <p className="text-xl text-green-600">
                        {tokens[request._id]}
                      </p>

                      <div className="mt-4">
                        <p className="text-lg font-semibold">QR Code:</p>
                        <QRCodeSVG value={tokens[request._id]} size={128} />
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                No loan requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoanRequestTable;
