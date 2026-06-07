"use client";

import { useAuth } from "../../context/auth-context";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, dbUser } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
          <p className="text-xl font-semibold">Please sign in first.</p>
          <Link href="/auth/signin" className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
            Go to login
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
          <h1 className="text-4xl font-semibold">Welcome, {user.displayName || user.email}</h1>
          <p className="max-w-2xl text-slate-600">
            Your account is connected via Firebase. You can manage your orders and profile here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">Account Details</h2>
            <p className="mt-3 text-slate-600">Email: {user.email}</p>
            <p className="mt-1 text-slate-600">Status: {dbUser?.role || 'Customer'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">Quick Links</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/products" className="text-sky-700 hover:underline">Browse Products</Link>
              <Link href="/orders" className="text-sky-700 hover:underline">View My Orders</Link>
              <Link href="/cart" className="text-sky-700 hover:underline">My Shopping Cart</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
