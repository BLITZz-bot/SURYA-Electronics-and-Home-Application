/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "../../../context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getApiUrl } from "../../../lib/api-utils";

export default function AccountPage() {
  const { user, dbUser, loading, logout, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  const fetchAddresses = useCallback(async () => {
    if (!token) return;
    setLoadingAddresses(true);
    try {
      const res = await fetch(getApiUrl("/api/addresses"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  }, [token]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch(getApiUrl("/api/orders/my-orders"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      if (activeTab === "addresses") fetchAddresses();
      if (activeTab === "orders") fetchOrders();
    }
  }, [user, token, activeTab, fetchAddresses, fetchOrders]);

  const deleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/addresses/${id}`), {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/addresses/${id}/default`), {
        method: "PATCH",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
      }
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    houseNumber: "",
    street: "",
    area: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    postalCode: "",
    latitude: null as number | null,
    longitude: null as number | null,
    isDefault: false
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl("/api/addresses"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(newAddress)
      });
      if (res.ok) {
        const added = await res.json();
        setAddresses([...addresses, added]);
        setShowAddForm(false);
        setNewAddress({ 
          name: "", phone: "", houseNumber: "", street: "", area: "", 
          city: "", district: "", state: "", country: "India", 
          postalCode: "", latitude: null, longitude: null, isDefault: false 
        });
      }
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amazon-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#0F3D6E]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-amazon-bg py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500">
           <Link href="/" className="hover:underline">Home</Link>
           <span>›</span>
           <span className="font-bold text-gray-900 tracking-tight">Your Account</span>
        </div>

        <h1 className="text-3xl font-bold mb-10 text-gray-900 tracking-tight">Your Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 space-y-3">
            {[
              { id: "profile", label: "Profile Settings", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )},
              { id: "addresses", label: "Saved Addresses", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )},
              { id: "orders", label: "Order History", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              )}
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 group ${activeTab === tab.id ? "bg-[#0F3D6E] text-white shadow-lg shadow-[#0F3D6E]/20 font-bold" : "bg-white hover:bg-gray-50 border border-gray-100 text-gray-700"}`}
              >
                <span className={`${activeTab === tab.id ? "text-amazon-orange" : "text-gray-400 group-hover:text-[#0F3D6E]"}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            
            <button 
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100 transition-all mt-6 font-bold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout Account
            </button>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 bg-white p-8 md:p-10 border border-gray-100 shadow-sm rounded-3xl min-h-[600px]">
            
            {activeTab === "profile" && (
              <section className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between border-b pb-6">
                   <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                   <span className="px-3 py-1 bg-[#0F3D6E]/10 text-[#0F3D6E] text-xs font-bold rounded-full uppercase tracking-tighter">{dbUser?.role || "Customer"}</span>
                </div>
                
                <div className="grid gap-8 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <p className="text-xl font-medium text-gray-900 border-b border-gray-50 pb-2">{dbUser?.name || user.displayName || "Unspecified"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <p className="text-xl font-medium text-gray-900 border-b border-gray-50 pb-2">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Firebase UID</label>
                    <p className="text-sm font-mono text-gray-400 truncate">{user.uid}</p>
                  </div>
                </div>
                
                <div className="pt-10 border-t mt-10">
                   <h3 className="font-bold text-lg mb-4">Security</h3>
                   <button className="text-sm font-bold text-[#0F3D6E] hover:underline flex items-center gap-1">
                      Change password using Firebase →
                   </button>
                </div>
              </section>
            )}

            {activeTab === "addresses" && (
              <section className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b pb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                  {!showAddForm && (
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="bg-amazon-orange text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 shadow-md transform transition-all active:scale-95"
                    >
                      + Add New
                    </button>
                  )}
                </div>
                
                {showAddForm && (
                  <form onSubmit={handleAddAddress} className="bg-gray-50 p-8 rounded-3xl border-2 border-[#0F3D6E]/10 space-y-6">
                    <h3 className="font-bold text-lg text-[#0F3D6E]">New Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
                        <input required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Phone</label>
                        <input required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">House No. / Building</label>
                        <input required value={newAddress.houseNumber} onChange={e => setNewAddress({...newAddress, houseNumber: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Street / Road Name</label>
                        <input required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Area / Landmark</label>
                        <input value={newAddress.area} onChange={e => setNewAddress({...newAddress, area: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">City</label>
                        <input required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">District</label>
                        <input value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">State</label>
                        <input required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Postal Code</label>
                        <input required value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Latitude</label>
                        <input type="number" step="any" value={newAddress.latitude || ""} onChange={e => setNewAddress({...newAddress, latitude: e.target.value ? parseFloat(e.target.value) : null})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" placeholder="Optional" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Longitude</label>
                        <input type="number" step="any" value={newAddress.longitude || ""} onChange={e => setNewAddress({...newAddress, longitude: e.target.value ? parseFloat(e.target.value) : null})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" placeholder="Optional" />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className="bg-[#0F3D6E] text-white px-10 py-3 rounded-full font-bold hover:bg-black shadow-lg transition-all active:scale-95">Save Location</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="bg-white border border-gray-200 text-gray-600 px-10 py-3 rounded-full font-bold hover:bg-gray-50 transition-all">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="grid gap-6">
                  {loadingAddresses ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed">
                      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#0F3D6E] mb-4"></div>
                      <p className="text-gray-400 font-medium">Updating addresses...</p>
                    </div>
                  ) : addresses.length > 0 ? (
                    addresses.map((addr: any) => (
                      <div key={addr.id} className="border border-gray-100 p-8 rounded-[40px] relative group hover:border-[#0F3D6E]/30 transition-all bg-gray-50 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-8">
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-3 mb-4">
                              {addr.isDefault && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Default Address</span>}
                           </div>
                           <p className="text-xl font-black text-gray-900 leading-tight">{addr.name}</p>
                           <div className="text-gray-600 text-sm space-y-0.5 font-medium">
                              <p>{addr.houseNumber}, {addr.street}</p>
                              {addr.area && <p>{addr.area}</p>}
                              <p>{addr.city}, {addr.district}</p>
                              <p>{addr.state} - {addr.postalCode}</p>
                              <p className="uppercase tracking-widest font-bold pt-2 text-[#0F3D6E]">{addr.country}</p>
                           </div>
                           <p className="text-gray-900 font-bold mt-6 text-sm flex items-center gap-2 bg-white w-fit px-4 py-1.5 rounded-full border border-gray-100">
                              <span className="text-gray-400">Phone:</span> {addr.phone}
                           </p>
                        </div>
                        <div className="flex gap-4">
                           {!addr.isDefault && (
                              <button 
                                onClick={() => handleSetDefault(addr.id)}
                                className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-[#0F3D6E]/5 hover:border-[#0F3D6E] text-gray-400 hover:text-[#0F3D6E] transition-all shadow-sm group/btn"
                                title="Set as Default"
                              >
                                 <CheckCircle2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                           )}
                           <button className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-white hover:border-[#0F3D6E] text-gray-400 hover:text-[#0F3D6E] transition-all shadow-sm">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                           </button>
                           <button onClick={() => deleteAddress(addr.id)} className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-rose-50 hover:border-rose-200 text-gray-400 hover:text-rose-600 transition-all shadow-sm">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <p className="font-medium">No saved addresses found.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "orders" && (
              <section className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b pb-6">
                   <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                   <Link href="/products" className="text-sm font-bold text-[#0F3D6E] hover:underline">Start Shopping →</Link>
                </div>
                
                <div className="space-y-6">
                  {loadingOrders ? (
                    <div className="text-center py-20">
                       <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0F3D6E] mx-auto mb-4"></div>
                       <p className="text-gray-400">Loading your history...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order: any) => (
                      <div key={order.id} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                         <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <div>Order Placed: <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                            <div>Total: <span className="text-gray-900">₹{Number(order.totalAmount).toLocaleString()}</span></div>
                            <div>Status: <span className={`${order.status === 'delivered' ? 'text-emerald-600' : 'text-[#0F3D6E]'}`}>{order.status}</span></div>
                            <div className="text-[#0F3D6E]">Order #{order.id.slice(-8)}</div>
                         </div>
                         <div className="p-6">
                            {order.items?.map((item: any) => (
                               <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                                  <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                                     <img src={item.product?.imageUrl} alt={item.product?.name} className="max-h-full object-contain" />
                                  </div>
                                  <div>
                                     <p className="font-bold text-gray-900 line-clamp-1">{item.product?.name}</p>
                                     <p className="text-xs text-gray-500 italic">Qty: {item.quantity}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed">
                       <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                       <p className="text-gray-400 font-medium">You haven&apos;t placed any orders yet.</p>
                       <Link href="/products" className="mt-4 inline-block bg-[#0F3D6E] text-white px-8 py-3 rounded-full font-bold shadow-lg transform active:scale-95">Shop Catalog</Link>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
