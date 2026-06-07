"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/auth-context";
import { getApiUrl } from "../../../lib/api-utils";
import Link from "next/link";

export default function AdminOffersPage() {
  const { token, isAdmin } = useAuth();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowReviewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Bank",
    startDate: "",
    endDate: "",
    status: "active"
  });

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/offers"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setOffers(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) fetchOffers();
  }, [token, isAdmin, fetchOffers]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? getApiUrl(`/api/offers/${editingId}`) : getApiUrl("/api/offers");
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        fetchOffers();
        setShowReviewForm(false);
        setEditingId(null);
        setForm({ title: "", description: "", type: "Bank", startDate: "", endDate: "", status: "active" });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteOffer(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/offers/${id}`), {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchOffers();
    } catch (err) {
      console.error(err);
    }
  }

  if (!isAdmin) return <div className="p-10">Access Denied</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Offer Management</h1>
          <p className="text-gray-500">Create and manage promotional offers shown on product pages</p>
        </div>
        <button 
          onClick={() => { setShowReviewForm(true); setEditingId(null); }}
          className="bg-[#0F3D6E] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-all"
        >
          + Create New Offer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 animate-in slide-in-from-top duration-500">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-[#0F3D6E]">{editingId ? 'Edit Offer' : 'New Offer'}</h2>
            <button type="button" onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase">Cancel</button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400">Offer Title</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" placeholder="e.g. HDFC Bank Discount" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400">Offer Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none">
                <option>Bank</option>
                <option>Exchange</option>
                <option>Festival</option>
                <option>Cashback</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-black uppercase text-gray-400">Description</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" placeholder="Details of the offer..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400">Start Date</label>
              <input required type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400">End Date</label>
              <input required type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3D6E] outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0F3D6E] text-white py-4 rounded-full font-bold shadow-lg hover:bg-black transition-all">
            {editingId ? 'Update Offer' : 'Create Offer'}
          </button>
        </form>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-bold">Loading offers...</div>
        ) : offers.length > 0 ? offers.map(offer => (
          <div key={offer.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#0F3D6E]/30 transition-all">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                {offer.type === 'Bank' ? '🏦' : offer.type === 'Festival' ? '🎆' : '🎁'}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{offer.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{offer.description}</p>
                <div className="flex gap-4 mt-1 text-[10px] font-black uppercase tracking-tighter text-gray-400">
                   <span>From: {new Date(offer.startDate).toLocaleDateString()}</span>
                   <span>To: {new Date(offer.endDate).toLocaleDateString()}</span>
                   <span className={offer.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}>{offer.status}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => {
                setEditingId(offer.id);
                setForm({
                  title: offer.title,
                  description: offer.description,
                  type: offer.type,
                  startDate: offer.startDate.split('T')[0],
                  endDate: offer.endDate.split('T')[0],
                  status: offer.status
                });
                setShowReviewForm(true);
              }} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#0F3D6E] hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={() => deleteOffer(offer.id)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        )) : (
          <div className="py-40 text-center text-gray-300 italic border-2 border-dashed border-gray-100 rounded-[40px]">No offers configured yet.</div>
        )}
      </div>
    </div>
  );
}
