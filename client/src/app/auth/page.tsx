"use client";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Auth() {
  const [loading, setLoading] = useState(true);
  const { auth, user, adminAuth, admin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user && admin) {
      router.push("/admin");
    } else if (user) {
      router.push("/loanuser");
    } else {
      setLoading(false);
    }
  }, [user]);

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    if (isLogin) {
      auth("/auth/loginloan", { email, password });
    } else {
      await adminAuth("/auth/login", { email, password });
    }
  }

  if (loading) return <span className="loading loading-ring loading-xs"></span>;

  return (
    <div className="flex-1 bg-slate-400 flex justify-center items-center">
      <motion.div
        className="p-10 rounded-2xl space-y-4 bg-slate-100 flex flex-col items-center shadow-lg shadow-white"
        key={isLogin ? "loginText-1" : "signupText-1"}
        initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isLogin ? 50 : -50 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl">Login Form</h1>

        <div className="flex justify-between items-center border-slate-700 border-[1px] rounded-lg overflow-hidden">
          <button
            className={`btn btn-ghost w-32 hover:bg-slate-50 transition-all duration-100 ${
              isLogin ? "!btn-active" : ""
            }`}
            onClick={() => setIsLogin(true)}
          >
            User
          </button>
          <button
            className={`btn btn-ghost w-32 hover:bg-slate-50 transition-all duration-100 ${
              !isLogin ? "!btn-active" : ""
            }`}
            onClick={() => setIsLogin(false)}
          >
            Admin
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleAuth}>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder={
                isLogin ? "user@example.com" : "admin@gmail.com (test)"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={isOpen ? "text" : "password"}
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="btn btn-link p-0 m-0"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          </label>

          <button
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            type="submit"
          >
            {"Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
