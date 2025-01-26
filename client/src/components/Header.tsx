"use client";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomAlert from "./Custom-Alert";
import { useState } from "react";

export default function Header() {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  return (
    <div className="bg-slate-300 shadow-md shadow-violet-400 flex justify-between items-center px-10 py-5">
      <h1 className="text-2xl font-semibold text-slate-700">
        Saylani Microfinance
      </h1>
      {user ? (
        <button
          className="btn btn-error bg-red-400 text-white"
          onClick={() => setIsAlertVisible(true)}
        >
          Logout
        </button>
      ) : (
        <Link
          href={pathname == "/" && !user ? "/auth" : "/"}
          className="btn btn-outline text-slate-700"
        >
          {pathname == "/" && !user ? "Login" : "Dashboard"}
        </Link>
      )}
      {isAlertVisible && (
        <CustomAlert
          onConfirm={() => {
            logout();
            setIsAlertVisible(false);
          }}
          onCancel={() => setIsAlertVisible(false)}
          message="Are you sure you want to logout ?"
        />
      )}
    </div>
  );
}
