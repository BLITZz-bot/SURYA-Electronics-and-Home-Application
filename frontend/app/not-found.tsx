"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="text-9xl font-black text-gray-100 select-none tracking-tighter">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Search size={80} className="text-[#0F3D6E] transform -rotate-12" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">Page Not Found</h1>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">
            We searched every shelf, but the page you're looking for has been moved or disconnected.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/"
            className="flex items-center gap-2 bg-[#0F3D6E] text-white px-8 py-3 rounded-full font-black shadow-xl shadow-[#0F3D6E]/20 hover:bg-black transition-all transform active:scale-95 uppercase text-sm tracking-widest"
          >
            <Home size={18} />
            Return Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-50 text-gray-600 px-8 py-3 rounded-full font-black hover:bg-gray-100 transition-all uppercase text-sm tracking-widest border border-gray-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <div className="pt-10 border-t border-gray-50 flex items-center justify-center gap-8">
           <Link href="/products" className="text-xs font-bold text-[#5DADE2] hover:underline uppercase tracking-widest">Browse Catalog</Link>
           <Link href="/account" className="text-xs font-bold text-[#5DADE2] hover:underline uppercase tracking-widest">My Account</Link>
        </div>
      </div>
    </main>
  );
}
