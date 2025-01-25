"use client";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

export default function Auth() {
  const [loading, setLoading] = useState(true);
  const { auth, user } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const [imageSrc, setImgSrc] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/loanuser");
    } else {
      setLoading(false);
    }
  }, [user]);

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    const url = isLogin ? "/auth/loginloan" : "/auth/signup";

    auth(url, isLogin ? { email, password } : { username, email, password });
  }

  useEffect(() => {
    sessionStorage.clear();
    setPassword("");
    setIsOpen(false);
  }, [isLogin]);

  // const handleUpload = (result: any) => {
  //   if (result) {
  //     console.log(result.info.secure_url);
  //     setImgSrc(result.info.secure_url);
  //   }
  // };

  if (loading) return <span className="loading loading-ring loading-xs"></span>;

  return (
    <div className="flex-1 bg-slate-400 flex justify-center items-center">
      <motion.div
        className="p-10 rounded-2xl space-y-4 bg-slate-100 flex flex-col items-center shadow-lg shadow-white"
        key={isLogin ? "loginForm" : "signupForm"}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl">{isLogin ? "Login Form" : "Signup Form"}</h1>

        <div className="flex justify-between items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-100 shadow-md">
          <button
            className={`w-36 py-2 font-medium text-lg transition-all duration-300 ${
              isLogin
                ? "bg-slate-800 text-white shadow-md"
                : "hover:bg-slate-200 text-slate-700"
            } rounded-l-lg`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-36 py-2 font-medium text-lg transition-all duration-300 ${
              !isLogin
                ? "bg-slate-800 text-white shadow-md"
                : "hover:bg-slate-200 text-slate-700"
            } rounded-r-lg`}
            onClick={() => setIsLogin(false)}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
              {/* <CldUploadWidget
                uploadPreset="hackathon"
                onSuccess={handleUpload}
                options={{
                  sources: ["local", "url", "unsplash"],
                  multiple: false,
                  maxFiles: 1,
                }}
              >
                {({ open }) => {
                  return (
                    <button className="btn btn-sm" onClick={() => open()}>
                      Upload Image
                    </button>
                  );
                }}
              </CldUploadWidget>
              {imageSrc && <img src={imageSrc} alt="tessty" />} */}
            </>
          )}

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
              placeholder="Email"
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
            {isLogin ? "Login" : "Sign up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
