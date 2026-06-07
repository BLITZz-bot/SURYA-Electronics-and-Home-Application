"use client";

import { useAuth } from "../context/auth-context";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return <div className="h-10 w-20 animate-pulse bg-slate-200 rounded-full" />;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => router.push("/auth/signin")}
        className="rounded-md bg-surya-light px-5 py-2 text-white font-bold transition hover:bg-surya-dark shadow-sm"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex gap-3 items-center">
      <button
        type="button"
        onClick={() => logout()}
        className="rounded-md bg-white border border-gray-300 px-5 py-2 text-gray-700 font-bold transition hover:bg-gray-100 shadow-sm"
      >
        Sign out
      </button>
    </div>
  );
}
