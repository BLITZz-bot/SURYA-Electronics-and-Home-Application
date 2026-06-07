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
        className="rounded-full bg-sky-600 px-5 py-3 text-white transition hover:bg-sky-700"
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
        className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
      >
        Sign out
      </button>
    </div>
  );
}
