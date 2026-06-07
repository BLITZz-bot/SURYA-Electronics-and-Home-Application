"use client";

import { useAuth } from "../../context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingCart, 
  Users, 
  Warehouse, 
  Ticket, 
  Star, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/users", icon: Users },
  { name: "Coupons", href: "/admin/offers", icon: Ticket },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, dbUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0F3D6E] border-t-transparent"></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Admin Portal</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased text-slate-900">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0F3D6E] text-white transition-transform duration-300 ease-in-out border-r border-white/10 shadow-2xl",
          !isSidebarOpen ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/5 bg-black/10">
            <Link href="/admin" className={cn("flex items-center gap-3 transition-all", !isSidebarOpen && "lg:hidden")}>
              <div className="w-10 h-10 bg-amazon-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Warehouse size={20} className="text-[#0F3D6E]" strokeWidth={3} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic text-white">SURYA <span className="text-amazon-orange not-italic">Admin</span></span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group relative",
                    isActive 
                      ? "bg-white/10 text-amazon-orange shadow-lg" 
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={20} className={cn("shrink-0", isActive ? "text-amazon-orange" : "text-blue-300 group-hover:text-white")} />
                  <span className={cn("transition-opacity duration-200", !isSidebarOpen && "lg:opacity-0 lg:absolute")}>{link.name}</span>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-amazon-orange rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 bg-black/10">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-blue-200 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut size={18} />
              <span className={cn(!isSidebarOpen && "lg:hidden")}>Exit to Shop</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        isSidebarOpen ? "lg:ml-[280px]" : "lg:ml-20"
      )}>
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#0F3D6E] transition-all hidden lg:block"
             >
               <Menu size={20} />
             </button>
             <div className="h-10 w-[1px] bg-gray-200 hidden lg:block" />
             <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <span className="hover:text-[#0F3D6E] cursor-pointer">Admin</span>
                <ChevronRight size={14} />
                <span className="text-[#0F3D6E] capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
             </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block w-64 group">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F3D6E] transition-colors" />
               <input 
                type="text" 
                placeholder="Global Search..." 
                className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-[#0F3D6E]/20 transition-all outline-none"
               />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
               <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 relative">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900 leading-none">{dbUser?.name || user.displayName || 'Admin'}</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Super Admin</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-[#0F3D6E] flex items-center justify-center text-white font-black shadow-lg shadow-[#0F3D6E]/20">
                  {user.email?.[0].toUpperCase()}
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
