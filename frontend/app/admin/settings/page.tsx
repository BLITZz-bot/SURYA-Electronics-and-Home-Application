"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "../../../lib/api-utils";
import { useAuth } from "../../../context/auth-context";
import { Loader2, Save, Globe, Shield, Activity, Truck } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token, isAdmin } = useAuth();

  useEffect(() => {
    if (token && isAdmin) {
      fetchSettings();
    }
  }, [token, isAdmin]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(getApiUrl("/api/settings"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        storeName: formData.get("storeName"),
        storeDescription: formData.get("storeDescription"),
        storeAddress: formData.get("storeAddress"),
        storeEmail: formData.get("storeEmail"),
        storePhone: formData.get("storePhone"),
        storeLatitude: formData.get("storeLatitude") ? parseFloat(formData.get("storeLatitude") as string) : null,
        storeLongitude: formData.get("storeLongitude") ? parseFloat(formData.get("storeLongitude") as string) : null,
        shippingFee: parseFloat(formData.get("shippingFee") as string),
        freeShippingThreshold: parseFloat(formData.get("freeShippingThreshold") as string),
        deliveryTime: formData.get("deliveryTime"),
        taxRate: parseFloat(formData.get("taxRate") as string),
        currency: formData.get("currency"),
      };

      const res = await fetch(getApiUrl("/api/settings"), {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update settings");
      
      const updated = await res.json();
      setSettings(updated);
      setSuccess("Store parameters synchronized successfully.");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#0F3D6E]" />
        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Accessing Core Config...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-10 max-w-7xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Store Configuration</h1>
        <p className="text-sm text-gray-500 font-medium">Calibrate your retail environment and fulfillment logic</p>
      </div>

      {error && (
        <div className="p-5 bg-rose-50 border-2 border-rose-100 rounded-3xl text-rose-700 text-sm font-bold animate-shake">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-3xl text-emerald-700 text-sm font-bold">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Identity Section */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 space-y-8 shadow-sm">
            <h2 className="text-xl font-black text-[#0F3D6E] uppercase tracking-[0.2em] flex items-center gap-3">
               <Globe className="text-[#0F3D6E]" size={24} />
               Global Identity
            </h2>

            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Store Branding Name</label>
                 <input
                   type="text"
                   name="storeName"
                   defaultValue={settings?.storeName}
                   className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none transition-all"
                   required
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Warehouse / HQ Physical Address</label>
                 <textarea
                   name="storeAddress"
                   defaultValue={settings?.storeAddress}
                   rows={3}
                   className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none transition-all"
                   placeholder="Legal address for dispatch..."
                 />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">GPS Latitude</label>
                     <input type="number" step="any" name="storeLatitude" defaultValue={settings?.storeLatitude} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">GPS Longitude</label>
                     <input type="number" step="any" name="storeLongitude" defaultValue={settings?.storeLongitude} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none transition-all" />
                  </div>
               </div>
            </div>
          </div>

          {/* Logistics Section */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 space-y-8 shadow-sm">
            <h2 className="text-xl font-black text-[#5DADE2] uppercase tracking-[0.2em] flex items-center gap-3">
               <Truck className="text-[#5DADE2]" size={24} />
               Logistics Engine
            </h2>

            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Base Shipping Tariff (₹)</label>
                 <input
                   type="number"
                   name="shippingFee"
                   defaultValue={Number(settings?.shippingFee)}
                   step="0.01"
                   className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#5DADE2]/10 outline-none transition-all"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Free Delivery Threshold (₹)</label>
                 <input
                   type="number"
                   name="freeShippingThreshold"
                   defaultValue={Number(settings?.freeShippingThreshold)}
                   step="0.01"
                   className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#5DADE2]/10 outline-none transition-all"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Promised Fulfillment Window</label>
                 <input
                   type="text"
                   name="deliveryTime"
                   defaultValue={settings?.deliveryTime}
                   className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#5DADE2]/10 outline-none transition-all"
                   placeholder="e.g. 24-48 Hours"
                 />
               </div>

               <div className="pt-6">
                  <div className="flex items-center gap-4 bg-[#0F3D6E]/5 p-6 rounded-3xl border border-[#0F3D6E]/10">
                     <div className={cn("w-4 h-4 rounded-full shadow-lg", settings?.isConfigured ? "bg-emerald-500 shadow-emerald-500/50 animate-pulse" : "bg-gray-300")}></div>
                     <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest text-[#0F3D6E]">
                           {settings?.isConfigured ? "Logistics Online" : "System Standby"}
                        </span>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">Shipping automation is {settings?.isConfigured ? "engaged" : "waiting for config"}.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="bg-[#0F3D6E] hover:bg-black disabled:bg-gray-200 text-white font-black py-5 px-16 rounded-[30px] transition-all shadow-2xl shadow-[#0F3D6E]/20 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Synchronize Parameters
          </button>
        </div>
      </form>

      <div className="bg-white rounded-[40px] border border-gray-100 p-10 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <Shield className="text-[#0F3D6E]" size={32} />
            <div>
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Administrative Control</h3>
               <p className="text-sm text-gray-400 font-medium">Active root: bharatha9483@gmail.com</p>
            </div>
         </div>
         <Link href="/" className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 transition-all">Audit Permissions</Link>
      </div>
    </div>
  );
}
