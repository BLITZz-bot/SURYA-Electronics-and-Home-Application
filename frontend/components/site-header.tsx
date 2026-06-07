"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/auth-context";
import { useRouter } from "next/navigation";
import AuthButton from "./auth-button";

export default function SiteHeader() {
  const { user, isAdmin, token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchCartCount();
      fetchDefaultAddress();
    }
  }, [token]);

  async function fetchDefaultAddress() {
    try {
      const { getApiUrl } = await import("../lib/api-utils");
      const res = await fetch(getApiUrl("/api/addresses"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDefaultAddress(data.find((a: any) => a.isDefault) || data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { getApiUrl } = await import("../lib/api-utils");
      const res = await fetch(getApiUrl("/api/categories"));
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }

  async function fetchCartCount() {
    try {
      const { getApiUrl } = await import("../lib/api-utils");
      const res = await fetch(getApiUrl("/api/cart"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartCount(Array.isArray(data) ? data.length : (data.items?.length || 0));
      }
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Main Header */}
      <div className="bg-[#0F3D6E] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center p-2 hover:outline outline-1 outline-white rounded-sm">
            <span className="text-xl font-bold tracking-tight">SURYA</span>
            <span className="text-amazon-orange text-xs font-bold mt-2 ml-1">Electronics</span>
          </Link>

          {/* Location */}
          <div className="hidden lg:flex flex-col p-2 hover:outline outline-1 outline-white rounded-sm cursor-pointer min-w-[120px]">
            <span className="text-[11px] text-gray-300 leading-none">Deliver to {user?.displayName?.split(' ')[0] || 'User'}</span>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-0.5 text-amazon-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-sm font-bold truncate max-w-[100px]">
                {defaultAddress ? `${defaultAddress.city}` : 'Select Location'}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-1 h-10 group">
            <select className="hidden md:block bg-gray-100 text-gray-700 text-xs px-2 rounded-l-md border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-amazon-orange">
              <option>All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-black text-sm focus:outline-none"
              placeholder="Search SURYA Electronics"
            />
            <button 
              type="submit"
              className="bg-amazon-orange hover:bg-orange-500 p-2 rounded-r-md transition-colors"
            >
              <svg className="w-6 h-6 text-amazon-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <Link href={user ? "/account" : "/auth/signin"} className="hidden sm:flex flex-col p-2 hover:outline outline-1 outline-white rounded-sm">
              <span className="text-[11px] leading-none">Hello, {user?.displayName || (user?.email ? user.email.split('@')[0] : 'Sign in')}</span>
              <span className="text-sm font-bold">Account & Lists</span>
            </Link>

            <Link href="/orders" className="hidden sm:flex flex-col p-2 hover:outline outline-1 outline-white rounded-sm">
              <span className="text-[11px] leading-none">Returns</span>
              <span className="text-sm font-bold">& Orders</span>
            </Link>

            <Link href="/cart" className="flex items-end p-2 hover:outline outline-1 outline-white rounded-sm relative">
              <div className="relative">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="absolute -top-1 left-4 bg-amazon-dark text-amazon-orange text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-amazon-orange">
                  {cartCount}
                </span>
              </div>
              <span className="text-sm font-bold hidden md:block ml-1">Cart</span>
            </Link>

            {isAdmin && (
              <Link href="/admin" className="hidden lg:flex flex-col p-2 hover:outline outline-1 outline-white rounded-sm text-amazon-yellow">
                <span className="text-[11px] leading-none">Admin</span>
                <span className="text-sm font-bold">Portal</span>
              </Link>
            )}

            <div className="md:hidden">
               <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Nav */}
      <div className="bg-[#5DADE2] text-white overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="mx-auto flex max-w-[1500px] items-center px-4 h-10 gap-4 text-sm font-medium">
          <button className="flex items-center gap-1 p-2 hover:outline outline-1 outline-white rounded-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            All
          </button>
          {categories.slice(0, 6).map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.name}`} className="p-2 hover:outline outline-1 outline-white rounded-sm">
              {cat.name}
            </Link>
          ))}
          <div className="flex-1"></div>
          {token && (
            <button onClick={() => import("../lib/firebase").then(m => m.auth.signOut())} className="p-2 hover:outline outline-1 outline-white rounded-sm text-xs">
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="w-[80%] max-w-[350px] bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="bg-[#0F3D6E] text-white p-4 flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              <span className="text-lg font-bold">Hello, {user?.displayName || 'Sign in'}</span>
            </div>
            <nav className="p-4 space-y-6">
              <section>
                <h3 className="text-lg font-bold mb-2">Shop By Category</h3>
                <ul className="space-y-4 text-sm text-gray-700">
                  <li><Link href="/products" onClick={() => setIsMenuOpen(false)}>All Electronics</Link></li>
                  {categories.map(cat => (
                    <li key={cat.id}><Link href={`/products?category=${cat.name}`} onClick={() => setIsMenuOpen(false)}>{cat.name}</Link></li>
                  ))}
                </ul>
              </section>
              <section className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold mb-2">Help & Settings</h3>
                <ul className="space-y-4 text-sm text-gray-700">
                  <li><Link href="/account" onClick={() => setIsMenuOpen(false)}>Your Account</Link></li>
                  <li><Link href="/orders" onClick={() => setIsMenuOpen(false)}>Your Orders</Link></li>
                  {isAdmin && <li><Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-blue-600">Admin Panel</Link></li>}
                  <li><AuthButton /></li>
                </ul>
              </section>
            </nav>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
}
