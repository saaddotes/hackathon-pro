import React from "react";

interface LoanRequest {
  _id: string;
  schedule: { date: string; time: string; officeLocation: string };
  guarantors: { name: string; email: string; cnic: string }[];
  status: string;
}

interface LoanRequestTableProps {
  loanRequests: LoanRequest[];
  onAddDetails: (requestId: string) => void;
}

const LoanRequestTable: React.FC<LoanRequestTableProps> = ({
  loanRequests,
  onAddDetails,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-sm table-zebra">
        <thead className="bg-primary text-white">
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
            loanRequests.map((request) => (
              <tr key={request._id} className="hover:bg-base-200">
                <td>{new Date(request.schedule.date).toLocaleDateString()}</td>
                <td>{request.schedule.time}</td>
                <td>{request.schedule.officeLocation}</td>
                <td>
                  {request.guarantors.map((guarantor, idx) => (
                    <div key={idx}>{guarantor.name}</div>
                  ))}
                </td>
                <td>
                  {request.guarantors.map((guarantor, idx) => (
                    <div key={idx}>{guarantor.email}</div>
                  ))}
                </td>
                <td>
                  {request.guarantors.map((guarantor, idx) => (
                    <div key={idx}>{guarantor.cnic}</div>
                  ))}
                </td>
                <td>
                  <span
                    className={`badge ${
                      request.status === "pending"
                        ? "badge-warning"
                        : "badge-success"
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
