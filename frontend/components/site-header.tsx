"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthButton from "./auth-button";

export default function SiteHeader() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          SURYA Electronics
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Products
          </Link>
          <Link href="/cart" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Cart
          </Link>
          <Link href="/orders" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Orders
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {session?.user?.email && (
            <div className="hidden min-w-[220px] flex-col rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:flex">
              <span className="font-medium">{session.user.name ?? session.user.email}</span>
              <span className="text-slate-500">{session.user.role}</span>
            </div>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
