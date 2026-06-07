"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Navigation, Plus, CheckCircle2, ChevronRight, Loader2, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/auth-context";
import { getApiUrl } from "../lib/api-utils";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: any) => void;
}

export default function LocationModal({ isOpen, onClose, onAddressSelect }: LocationModalProps) {
  const { token, user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/addresses"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && token) {
      fetchAddresses();
    }
  }, [isOpen, token, fetchAddresses]);

  const handleUseCurrentLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, we'd reverse geocode here. 
          // For now, we'll just mock a 'Current Location' address object.
          onAddressSelect({ city: "Current Location", country: "India", latitude, longitude });
          setLocating(false);
          onClose();
        },
        (error) => {
          console.error(error);
          setLocating(false);
          alert("Could not access your location. Please check browser permissions.");
        }
      );
    } else {
      setLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", houseNumber: "", street: "", area: "", 
    city: "", district: "", state: "", country: "India", 
    postalCode: "", isDefault: false 
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
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
        onAddressSelect(added);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[550px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0F3D6E] text-white p-6 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
              <MapPin className="text-amazon-orange" size={24} />
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Delivery Location</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
           {showAddForm ? (
             <form onSubmit={handleAddAddress} className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="font-black text-[#0F3D6E] uppercase tracking-widest text-xs">Manual Entry</h3>
                   <button type="button" onClick={() => setShowAddForm(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600">BACK TO LIST</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <input required placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="col-span-2 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0F3D6E]/10" />
                   <input required placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" />
                   <input required placeholder="House/Bldg No." value={newAddress.houseNumber} onChange={e => setNewAddress({...newAddress, houseNumber: e.target.value})} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" />
                   <input required placeholder="Street Name" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="col-span-2 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" />
                   <input required placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" />
                   <input required placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#0F3D6E] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all disabled:opacity-50">
                   {loading ? <Loader2 className="animate-spin mx-auto" /> : "Save & Deliver Here"}
                </button>
             </form>
           ) : (
             <>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Select a delivery location to see product availability and delivery options.
               </p>

               {/* Quick Actions */}
               <div className="grid gap-3">
                  <button 
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition-all group"
                  >
                     <div className="flex items-center gap-4">
                        {locating ? <Loader2 size={20} className="text-[#0F3D6E] animate-spin" /> : <Navigation size={20} className="text-[#0F3D6E]" />}
                        <span className="text-sm font-black text-[#0F3D6E] uppercase tracking-widest">Use my current location</span>
                     </div>
                     <ChevronRight size={16} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-[#0F3D6E]/20 transition-all group"
                  >
                     <div className="flex items-center gap-4">
                        <Plus size={20} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-600">Enter a new address</span>
                     </div>
                     <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>

               {/* Saved Addresses */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                     <CheckCircle2 size={12} />
                     <span>Your Saved Addresses</span>
                  </div>
                  
                  <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                     {loading ? (
                        <div className="py-10 text-center">
                           <Loader2 size={24} className="mx-auto text-gray-200 animate-spin" />
                        </div>
                     ) : addresses.length > 0 ? (
                        addresses.map((addr) => (
                          <button 
                            key={addr.id}
                            onClick={() => { onAddressSelect(addr); onClose(); }}
                            className="w-full text-left p-5 rounded-3xl border border-gray-100 hover:border-[#0F3D6E] hover:bg-gray-50 transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md"
                          >
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-[#0F3D6E] uppercase tracking-tighter">{addr.name}</span>
                                {addr.isDefault && <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Default</span>}
                             </div>
                             <p className="text-sm font-bold text-gray-900 truncate">{addr.houseNumber}, {addr.street}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{addr.city} - {addr.postalCode}</p>
                          </button>
                        ))
                     ) : (
                        <div className="py-10 text-center text-gray-300 italic text-sm">
                           No addresses saved in your account.
                        </div>
                     )}
                  </div>
               </div>
             </>
           )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 shrink-0">
           <Globe size={14} className="text-gray-400" />
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Delivering across all India</p>
        </div>
      </div>
    </div>
  );
}
