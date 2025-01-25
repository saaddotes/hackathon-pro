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
      <motion.h1
        className="text-3xl font-semibold text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Welcome to Admin Dashboard
      </motion.h1>

      {loadingRequests ? (
        <div className="text-center">Loading loan requests...</div>
      ) : loanRequests.length === 0 ? (
        <div className="text-center">No loan requests found.</div>
      ) : (
        <div>
          <h2 className="text-2xl mb-4">Loan Requests</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Guarantors</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loanRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.userId}</td>
                    <td>
                      {request.guarantors.map(
                        (gr: { name: string }, index: string) => (
                          <span key={index}>{gr.name}</span>
                        )
                      )}
                    </td>
                    <td>{request.status}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setModalData(request)} // Set data for modal
                      >
                        More Info
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalData && (
        <LoanRequestModal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
}
