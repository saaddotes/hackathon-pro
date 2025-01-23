"use client";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <div className="bg-slate-300 shadow-2xl shadow-violet-400 flex justify-between items-center px-10 py-5">
      <h1 className="text-2xl font-semibold text-slate-700">Hackathon</h1>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link href={"/auth"} className="btn btn-outline text-slate-700">
          Login
        </Link>
      )}
    </div>
  );
}
