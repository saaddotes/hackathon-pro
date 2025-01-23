"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/auth");
    }
  }, [user]);

  if (!user) return <span className="loading loading-ring loading-xs"></span>;

  return <div>Admin Page</div>;
}
