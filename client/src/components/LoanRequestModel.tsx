import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoanRequestModal({
  modalData,
  setModalData,
}: {
  modalData: any | null;
  setModalData: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
    officeLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleApproveLoan = async () => {
    setLoading(true);

    if (!schedule.date || !schedule.time || !schedule.officeLocation) {
      toast.error("Please fill in all schedule details.");
      setLoading(false);
      return;
    }

    try {
      const data = {
        loanId: modalData._id,
        scheduleDetails: schedule,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/approveloan`,
        data
      );

      if (response.data.success) {
        setModalData(null);
      } else {
        toast.error(response.data.message || "Failed to approve the loan.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!modalData) return null;
  console.log(modalData);
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <h1>Hello test</h1>
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        {!isScheduling ? (
          <>
            <h2 className="text-2xl font-semibold">Loan Request Details</h2>
            <div className="mt-4 space-y-2">
              <p>
                <strong>User:</strong> {modalData?.userId?.cnic}
              </p>
              <p>
                <strong>Status:</strong> {modalData?.status}
              </p>
              <p>
                <strong>Guarantors:</strong>{" "}
                {modalData.guarantors.map(
                  (guarantor: { name: string }, index: string) => (
                    <span className="badge" key={index}>
                      {guarantor?.name}
                    </span>
                  )
                )}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {modalData?.selectedLoan?.estimatedLoan.loanAmount}
              </p>
              <p>
                <strong>Period:</strong> {modalData?.selectedLoan?.loanPeriod}
              </p>
              <p>
                <strong>Installment:</strong>{" "}
                {modalData?.selectedLoan?.estimatedLoan?.annualInstallment}
              </p>
            </div>
            <button
              onClick={() => {
                if (modalData?.status == "pending") {
                  setIsScheduling(true);
                } else {
                  setModalData(null);
                }
              }}
              className="btn btn-primary mt-4 w-full"
            >
              {modalData.status == "pending" ? "Proceed Further" : "close"}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold">Schedule Loan</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApproveLoan();
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={schedule.date}
                  onChange={(e) =>
                    setSchedule({ ...schedule, date: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input
                  type="time"
                  value={schedule.time}
                  onChange={(e) =>
                    setSchedule({ ...schedule, time: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Office Location
                </label>
                <input
                  type="text"
                  value={schedule.officeLocation}
                  onChange={(e) =>
                    setSchedule({ ...schedule, officeLocation: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="btn w-1/2 ml-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-1/2"
                >
                  {loading ? "Approving..." : "Approve Loan"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
