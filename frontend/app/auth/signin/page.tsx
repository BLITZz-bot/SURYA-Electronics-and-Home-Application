"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700">Sign in</p>
          <h1 className="text-4xl font-semibold">Continue with your Google account</h1>
          <p className="text-slate-600">
            SURYA Electronics uses secure Google authentication. No separate password required.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
          >
            Sign in with Google
          </button>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
