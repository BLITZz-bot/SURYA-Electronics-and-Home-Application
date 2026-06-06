import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import AuthButton from "../components/auth-button";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700">SURYA Electronics</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Login with Google for fast access.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Use your Google account to sign in and start shopping electronics, home appliances, and more.
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Authentication</h2>
              <p className="mt-1 text-sm text-slate-500">
                Google single sign-on keeps registration simple and secure.
              </p>
            </div>
            <AuthButton />
          </div>

          {session ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700">Welcome back, {session.user?.name ?? session.user?.email}.</p>
              <Link href="/dashboard" className="mt-4 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
              <p>Click the button to authenticate through Google and see the customer dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
