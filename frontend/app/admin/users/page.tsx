'use dynamic';

import { prisma } from "../../../lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'customer' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { totalAmount: true } }
    }
  });

  const totalSpent = (orders: any[]) => {
    return orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  };

  const admins = await prisma.user.count({ where: { role: 'admin' } });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600 mt-1">Manage customer accounts and view purchase history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Total Customers</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{customers.length}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0zM16.35 5.47a3 3 0 011.946 3.957 5.5 5.5 0 00-1.946-3.957zM19 13a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Admins</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{admins}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM16 11a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Orders</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Total Spent</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {customer.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <span className="font-medium text-slate-900">{customer.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{customer._count.orders}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">₹{totalSpent(customer.orders).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No customers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
