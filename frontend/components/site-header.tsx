"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/auth-context";
import AuthButton from "./auth-button";

export default function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-slate-900 shrink-0">
          SURYA Electronics
        </Link>

        {/* Desktop Navigation */}
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
          {/* Desktop User Info */}
          {user?.email && (
            <div className="hidden min-w-[220px] flex-col rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 lg:flex">
              <span className="font-medium truncate">{user.displayName ?? user.email}</span>
              <span className="text-slate-500">{isAdmin ? "Admin" : "Customer"}</span>
            </div>
          )}
          
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-50 md:hidden"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white p-6 shadow-xl md:hidden animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            {user?.email && (
              <div className="mb-2 flex flex-col rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <span className="font-bold text-slate-900">{user.displayName ?? user.email}</span>
                <span className="text-slate-500">{isAdmin ? "Admin Portal Access" : "Customer Account"}</span>
              </div>
            )}
            <Link 
              href="/products" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              Browse Products
            </Link>
            <Link 
              href="/cart" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              My Cart
            </Link>
            <Link 
              href="/orders" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              My Orders
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                Admin Dashboard
              </Link>
            )}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
