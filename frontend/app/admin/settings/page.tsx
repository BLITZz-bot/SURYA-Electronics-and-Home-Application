'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../../../lib/api-utils';
import { useAuth } from '../../../context/auth-context';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token, isAdmin } = useAuth();

  useEffect(() => {
    if (token && isAdmin) {
      fetchSettings();
    }
  }, [token, isAdmin]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(getApiUrl('/api/settings'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
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
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        storeName: formData.get('storeName'),
        storeDescription: formData.get('storeDescription'),
        storeAddress: formData.get('storeAddress'),
        storeEmail: formData.get('storeEmail'),
        storePhone: formData.get('storePhone'),
        storeLatitude: formData.get('storeLatitude') ? parseFloat(formData.get('storeLatitude') as string) : null,
        storeLongitude: formData.get('storeLongitude') ? parseFloat(formData.get('storeLongitude') as string) : null,
        shippingFee: parseFloat(formData.get('shippingFee') as string),
        freeShippingThreshold: parseFloat(formData.get('freeShippingThreshold') as string),
        deliveryTime: formData.get('deliveryTime'),
        taxRate: parseFloat(formData.get('taxRate') as string),
        currency: formData.get('currency'),
      };

      const res = await fetch(getApiUrl('/api/settings'), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      
      const updated = await res.json();
      setSettings(updated);
      setSuccess('Settings updated successfully!');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) return <div className="p-8 text-center">Access Denied</div>;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage store configuration and preferences</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Store & Warehouse</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Store Name</label>
              <input
                type="text"
                name="storeName"
                defaultValue={settings?.storeName}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Detailed Store Address</label>
              <textarea
                name="storeAddress"
                defaultValue={settings?.storeAddress}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]"
                placeholder="Full address for delivery calculation..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Latitude</label>
                  <input type="number" step="any" name="storeLatitude" defaultValue={settings?.storeLatitude} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Longitude</label>
                  <input type="number" step="any" name="storeLongitude" defaultValue={settings?.storeLongitude} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Store Email</label>
                <input type="email" name="storeEmail" defaultValue={settings?.storeEmail} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Store Phone</label>
                <input type="tel" name="storePhone" defaultValue={settings?.storePhone} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]" />
              </div>
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Configuration</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Standard Delivery Cost (₹)</label>
              <input
                type="number"
                name="shippingFee"
                defaultValue={Number(settings?.shippingFee)}
                step="0.01"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                defaultValue={Number(settings?.freeShippingThreshold)}
                step="0.01"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Estimated Delivery Time (Text)</label>
              <input
                type="text"
                name="deliveryTime"
                defaultValue={settings?.deliveryTime}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D6E]"
                placeholder="e.g. 2-4 business days"
              />
            </div>

            <div className="pt-4 flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
               <div className={`w-4 h-4 rounded-full ${settings?.isConfigured ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
               <span className="text-sm font-bold text-blue-900">
                  {settings?.isConfigured ? 'Shipping System Online' : 'System Pending Configuration'}
               </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>

      {/* Admin Management (Display Only for now) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Admin Management</h2>
        <p className="text-sm text-slate-600">Primary admin account: bharatha9483@gmail.com</p>
      </div>
    </div>
  );
}
