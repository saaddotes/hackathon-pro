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
  const { user, loading } = useAuth(); // Assuming your auth context has a `loading` state

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/auth");
    }
  }, [user, loading]);

  // Show a loading indicator while waiting for user authentication status
  if (loading) {
    return <span className="loading loading-ring loading-xs"></span>;
  }

  // Block rendering until the user is verified or redirected
  if (!user) return null;

  return <>{children}</>;
}
