'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        storeName: formData.get('storeName'),
        storeDescription: formData.get('storeDescription'),
        supportEmail: formData.get('supportEmail'),
        supportPhone: formData.get('supportPhone'),
        shippingFee: parseFloat(formData.get('shippingFee') as string),
        freeShippingThreshold: parseFloat(formData.get('freeShippingThreshold') as string),
        taxRate: parseFloat(formData.get('taxRate') as string),
        currency: formData.get('currency'),
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
            <h2 className="text-xl font-bold text-slate-900 mb-6">Store Information</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Store Name</label>
              <input
                type="text"
                name="storeName"
                defaultValue={settings?.storeName}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Store Description</label>
              <textarea
                name="storeDescription"
                defaultValue={settings?.storeDescription}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                defaultValue={settings?.supportEmail}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Support Phone</label>
              <input
                type="tel"
                name="supportPhone"
                defaultValue={settings?.supportPhone}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Shipping & Taxes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping & Taxes</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                name="shippingFee"
                defaultValue={Number(settings?.shippingFee)}
                step="0.01"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                defaultValue={Number(settings?.freeShippingThreshold)}
                step="0.01"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                defaultValue={Number(settings?.taxRate)}
                step="0.01"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Default Currency</label>
              <select 
                name="currency"
                defaultValue={settings?.currency}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
              </select>
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
