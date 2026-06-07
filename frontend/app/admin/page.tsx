'use dynamic';

import { prisma } from "../../lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  // Revenue and order metrics
  const deliveredOrders = await prisma.order.findMany({
    where: { status: 'delivered' },
    select: { totalAmount: true }
  });
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
  const shippedOrders = await prisma.order.count({ where: { status: 'shipped' } });
  const deliveredCount = await prisma.order.count({ where: { status: 'delivered' } });
  
  const totalProducts = await prisma.product.count();
  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lte: 5 } },
    take: 5,
    orderBy: { stock: 'asc' }
  });
  const outOfStockCount = await prisma.product.count({ where: { stock: 0 } });
  
  const totalCustomers = await prisma.user.count({ where: { role: 'customer' } });

  // Today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysOrders = await prisma.order.count({ where: { createdAt: { gte: today } } });
  const todaysRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { createdAt: { gte: today }, status: 'delivered' }
  });

  // Recent orders with full details
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, email: true, name: true } },
      items: { include: { product: { select: { name: true, price: true } } } }
    }
  });

  // Low stock alerts
  const criticalStock = lowStockProducts.filter(p => p.stock <= 2).length;

  // Pending payments
  const pendingPayments = await prisma.order.count({
    where: { paymentStatus: 'pending', paymentMethod: { not: 'COD' } }
  });

  return (
    <div className="space-y-6 p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">SURYA Electronics Admin Control Center</p>
        </div>
        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <Link href="/admin/orders" className="group">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">Total Revenue</p>
                <p className="text-4xl font-bold mt-3">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <p className="text-emerald-100 text-sm mt-2">{deliveredCount} delivered orders</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.16 2.75a.75.75 0 01.68 0l3.5 1.84c.216.114.368.312.368.54v2.66h3.5A1.75 1.75 0 0118 9.5v6.75A1.75 1.75 0 0116.25 18H3.75A1.75 1.75 0 012 16.25V9.5a1.75 1.75 0 011.75-1.75h3.5V5.09c0-.228.152-.426.368-.54l3.5-1.84zM5.5 8.75h9v7.5h-9v-7.5zm4.25 2a.75.75 0 00-.75.75v2a.75.75 0 001.5 0v-2a.75.75 0 00-.75-.75z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Total Orders Card */}
        <Link href="/admin/orders" className="group">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide">Orders</p>
                <p className="text-4xl font-bold mt-3">{totalOrders}</p>
                <p className="text-blue-100 text-sm mt-2">{todaysOrders} today</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Products Card */}
        <Link href="/admin/products" className="group">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-xs font-semibold uppercase tracking-wide">Products</p>
                <p className="text-4xl font-bold mt-3">{totalProducts}</p>
                <p className={`text-sm mt-2 ${outOfStockCount > 0 ? 'text-red-200' : 'text-purple-100'}`}>
                  {outOfStockCount} out of stock
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Customers Card */}
        <Link href="/admin/customers" className="group">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-100 text-xs font-semibold uppercase tracking-wide">Customers</p>
                <p className="text-4xl font-bold mt-3">{totalCustomers}</p>
                <p className="text-orange-100 text-sm mt-2">Total registered</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7zM14 6a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h8z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-amber-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.82 1.573l-7 10.666A1 1 0 018 17H5a3 3 0 01-3-3V6zm5.68 9.05a1 1 0 10-1.36-1.465l-3 3.464a1 1 0 101.36 1.465l3-3.464zM9 6a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Pending Orders</p>
            <p className="text-2xl font-bold text-slate-900">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-slate-900">{shippedOrders}</p>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-slate-900">{deliveredCount}</p>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-slate-900">{lowStockProducts.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <p className="text-sm text-slate-600 mt-1">Last 10 orders</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2">
              View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Order ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
                        #{order.id.slice(-8).toUpperCase()}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{order.user.name || 'Customer'}</p>
                      <p className="text-xs text-slate-500">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-xs">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-lg font-bold text-slate-900">Low Stock Alert</h2>
            <p className="text-sm text-slate-600 mt-1">{lowStockProducts.length} products</p>
          </div>
          <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <Link key={product.id} href={`/admin/products/${product.id}`} className="block px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-2">{product.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{product.brand}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className={`font-bold text-sm ${product.stock <= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stock}
                      </p>
                      <p className="text-xs text-slate-500">units</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${product.stock <= 2 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(product.stock / 10 * 100, 100)}%` }}
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-500">
                <p className="text-sm">✓ All products well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
