import { prisma } from "../../lib/prisma";

export default async function AdminOverviewPage() {
  const productsCount = await prisma.product.count();
  const ordersCount = await prisma.order.count();
  const usersCount = await prisma.user.count();
  
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const aggregateResult = await prisma.order.aggregate({
    _sum: { totalAmount: true }
  });
  
  const totalRevenue = aggregateResult._sum.totalAmount || 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here&apos;s what&apos;s happening with SURYA Electronics today.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">₹{Number(totalRevenue).toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{ordersCount}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Products</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{productsCount}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Customers</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{usersCount}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm font-bold text-sky-600 hover:underline">View All</a>
          </div>
          <div className="space-y-6">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{order.user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₹{Number(order.totalAmount).toLocaleString()}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>{order.status}</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-center py-10 text-slate-400 text-sm italic">No recent orders.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Quick Tips</h2>
          <p className="text-sm text-slate-500 max-w-xs">
            Keep your inventory updated to ensure customers always see the latest products. Check orders daily to maintain fast shipping times!
          </p>
        </div>
      </div>
    </div>
  );
}
