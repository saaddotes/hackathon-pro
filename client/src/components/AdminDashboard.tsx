import { motion } from "framer-motion";
import LoanRequestModal from "@/components/LoanRequestModel";

export default function AdminDashboard({
  loanRequests,
  loadingRequests,
  setModalData,
  modalData,
}: {
  loanRequests: any[];
  loadingRequests: boolean;
  modalData: any;
  setModalData: React.Dispatch<React.SetStateAction<any>>;
}) {
  console.log("req => ", loanRequests);
  return (
    <div className=" min-h-screen py-10 px-5">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Admin Dashboard
      </h1>

      <table className="table w-full text-sm table-zebra">
        <thead className="bg-primary text-white">
          <tr>
            <th>Request ID</th>
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
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setModalData(request)} // Set data for modal
                  >
                    More Info
                  </button>
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

      {modalData && (
        <LoanRequestModal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
}
