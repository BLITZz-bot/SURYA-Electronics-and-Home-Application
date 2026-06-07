"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import AuthButton from "./auth-button";
import { Search, ShoppingCart, MapPin, Menu, ChevronDown, User, Package, Bell, LayoutGrid, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import CategoryDrawer from "./category-drawer";
import LocationModal from "./location-modal";

export default function SiteHeader() {
  const { user, isAdmin, token, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleAddressSelect = (address: any) => {
    setDefaultAddress(address);
  };

  useEffect(() => {
    if (token && !pathname.startsWith("/admin")) {
      fetchCartCount();
      fetchDefaultAddress();
    }
  }, [token, pathname]);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      fetchCategories();
    }
  }, [pathname]);

  // Live Search Logic
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const { getApiUrl } = await import("../lib/api-utils");
          const res = await fetch(getApiUrl(`/api/products?search=${encodeURIComponent(searchQuery)}`));
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.slice(0, 6));
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, pathname]);

  // Click outside search
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

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
    if (searchQuery.trim() || selectedCategory !== "All") {
      setShowSuggestions(false);
      let url = `/products?search=${encodeURIComponent(searchQuery)}`;
      if (selectedCategory !== "All") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      router.push(url);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 shadow-md font-sans">
      <CategoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} categories={categories} />
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onAddressSelect={handleAddressSelect} />
      
      {/* Main Header - Single Row */}
      <div className="bg-[#0F3D6E] text-white">
        <div className="mx-auto max-w-[1500px] flex items-center gap-2 md:gap-4 px-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center group p-1 hover:outline outline-1 outline-white/20 rounded-sm shrink-0">
            <span className="text-xl md:text-2xl font-black tracking-tighter italic">SURYA</span>
            <span className="text-amazon-orange text-[9px] md:text-[10px] font-black uppercase mt-1.5 ml-1 tracking-widest group-hover:translate-x-0.5 transition-transform underline decoration-amazon-orange underline-offset-4">Electronics</span>
          </Link>

          {/* Location */}
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden sm:flex flex-col px-2 py-1 hover:outline outline-1 outline-white/20 rounded-sm cursor-pointer min-w-[120px] shrink-0 transition-all"
          >
            <span className="text-[10px] text-blue-200 font-bold leading-none">Deliver to {user?.displayName?.split(' ')[0] || 'Guest'}</span>
            <div className="flex items-center mt-0.5">
              <MapPin size={12} className="mr-1 text-amazon-orange" />
              <span className="text-xs font-black truncate max-w-[90px]">
                {defaultAddress ? `${defaultAddress.city}` : 'Select Location'}
              </span>
            </div>
          </div>

          {/* Search Bar Group */}
          <div className="flex-1 relative h-10 group" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex h-full bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="hidden md:flex items-center bg-gray-100 text-gray-500 px-3 border-r border-gray-200 relative">
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setSelectedCategory(cat);
                    if (cat !== "All") {
                      router.push(`/products?category=${encodeURIComponent(cat)}`);
                    } else {
                      router.push('/products');
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                >
                  <option value="All">All Departments</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <span className="text-[10px] font-black uppercase tracking-widest pointer-events-none">{selectedCategory === 'All' ? 'All' : selectedCategory}</span>
                <ChevronDown size={12} className="ml-1.5 pointer-events-none" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                className="flex-1 px-4 py-2 text-black text-sm font-medium focus:outline-none placeholder-gray-400"
                placeholder="Search premium electronics..."
              />
              <button 
                type="submit"
                className="bg-amazon-orange hover:bg-orange-500 px-5 transition-all flex items-center justify-center active:scale-95"
              >
                <Search size={20} className="text-[#0F3D6E]" strokeWidth={3} />
              </button>
            </form>

            {/* Live Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-xl mt-1 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 z-[110]">
                 <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Top Matches</span>
                    <Search size={10} className="text-gray-300" />
                 </div>
                 {suggestions.map((p) => (
                   <Link 
                    key={p.id} 
                    href={`/products/${p.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-none"
                   >
                      <img src={p.imageUrl} alt="" className="w-8 h-8 object-contain bg-white rounded p-0.5 border border-gray-100" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                        <p className="text-[9px] font-black text-[#5DADE2] uppercase tracking-tighter">₹{Number(p.price).toLocaleString()}</p>
                      </div>
                   </Link>
                 ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-3 shrink-0">
            <Link href={user ? "/account" : "/auth/signin"} className="hidden md:flex flex-col px-2 py-1 hover:outline outline-1 outline-white/20 rounded-sm group transition-all">
              <span className="text-[10px] text-blue-200 font-bold leading-none">Hello, {user?.displayName?.split(' ')[0] || 'Sign in'}</span>
              <div className="flex items-center mt-0.5">
                 <span className="text-xs font-black tracking-tight group-hover:text-amazon-orange">Account</span>
                 <ChevronDown size={12} className="ml-0.5 text-blue-300" />
              </div>
            </Link>

            <Link href="/orders" className="hidden lg:flex flex-col px-2 py-1 hover:outline outline-1 outline-white/20 rounded-sm group transition-all">
              <span className="text-[10px] text-blue-200 font-bold leading-none">Returns</span>
              <span className="text-xs font-black tracking-tight mt-0.5 group-hover:text-amazon-orange">& Orders</span>
            </Link>

            <Link href="/cart" className="flex items-end px-2 py-1 hover:outline outline-1 outline-white/20 rounded-sm relative group transition-all">
              <div className="relative">
                <ShoppingCart size={24} className="text-white group-hover:text-amazon-orange transition-colors" />
                <span className="absolute -top-1.5 -right-1.5 bg-amazon-orange text-[#0F3D6E] text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 border-[#0F3D6E]">
                  {cartCount}
                </span>
              </div>
              <span className="text-xs font-black hidden xl:block ml-1 group-hover:text-amazon-orange uppercase tracking-widest">Cart</span>
            </Link>

            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-amazon-orange hover:text-[#0F3D6E] rounded-lg transition-all group shrink-0">
                <LayoutGrid size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
              </Link>
            )}

            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 text-white hover:text-amazon-orange transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Nav */}
      <div className="bg-[#5DADE2] text-white h-10 flex items-center">
        <div className="mx-auto max-w-[1500px] w-full px-4 flex items-center">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 hover:outline outline-1 outline-white/20 rounded-sm font-black text-xs uppercase tracking-widest transition-all"
          >
            <Menu size={18} />
            All
          </button>
          
          {token && (
            <button 
              onClick={handleSignOut} 
              className="px-2 py-1 hover:bg-rose-500 rounded-md transition-all text-[9px] font-black tracking-widest flex items-center gap-1.5 ml-auto"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
