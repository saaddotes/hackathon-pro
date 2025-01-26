"use client";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/auth");
    }
  }, [user, loading]);

  if (loading) {
    return <span className="loading loading-ring loading-xs"></span>;
  }

  if (!user) return null;

  return <>{children}</>;
}
