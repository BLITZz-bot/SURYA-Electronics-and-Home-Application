"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className="rounded-full bg-sky-600 px-5 py-3 text-white transition hover:bg-sky-700"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="font-medium text-slate-800">Signed in as {session.user?.email}</span>
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
      >
        Sign out
      </button>
    </div>
  );
}
