export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
          <p className="text-xl font-semibold">Please sign in first.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
            Return to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <div className="mb-8 flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700">Customer dashboard</p>
          <h1 className="text-4xl font-semibold">Welcome, {session.user?.name ?? session.user?.email}</h1>
          <p className="max-w-2xl text-slate-600">
            Your Google account is connected. Next you can build cart, orders, and profile pages on top of this auth flow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="mt-3 text-slate-600">Email: {session.user?.email}</p>
            <p className="mt-1 text-slate-600">Name: {session.user?.name ?? "Not provided"}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">Next steps</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>- Add product catalog and product pages</li>
              <li>- Add cart and checkout flows</li>
              <li>- Build admin product management</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
