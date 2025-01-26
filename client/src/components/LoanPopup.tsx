import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoanPopup({ category, onClose }: any) {
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [loanPeriod, setLoanPeriod] = useState(category.loanPeriod);
  const [estimatedLoan, setEstimatedLoan] = useState<any>(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    setLoading(true);
    const password = Math.random().toString(36).slice(-8);
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
        toast.success("Registration successful, check your email!");
        setLoading(false);
        onClose();
        router.push("/auth");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
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
                  {category.subcategories.map(
                    (subcategory: string, index: string) => (
                      <option key={index} value={subcategory}>
                        {subcategory}
                      </option>
                    )
                  )}
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
                className={`bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 ${
                  selectedSubcategory === "" ||
                  initialDeposit === 0 ||
                  loanPeriod === 0
                    ? "btn btn-disabled"
                    : ""
                } `}
                onClick={calculateLoan}
                disabled={
                  selectedSubcategory === "" ||
                  initialDeposit === 0 ||
                  loanPeriod === 0
                }
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
                  placeholder="saad"
                  className="w-full border rounded-lg p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">CNIC</label>
                <input
                  type="text"
                  placeholder="412051234567"
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
                  placeholder="saaddotes@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                className={`bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 ${
                  loading ? " btn btn-disabled " : ""
                }`}
                onClick={handleSubmit}
              >
                {loading ? "Loading" : "Register and Send Email"}
              </button>
            </>
          )}

          <button
            className="bg-red-500 text-white rounded-lg px-4 py-2 mt-4"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
