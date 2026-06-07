import { prisma } from "../../../lib/prisma";
import AdminOrderStatus from "../../../components/admin-order-status";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">All Orders</h2>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-slate-900 text-lg">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                  <p className="text-sm font-medium text-slate-700 mt-2">Customer: {order.user.email}</p>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Update Status</p>
                  <AdminOrderStatus orderId={order.id} currentStatus={order.status} onUpdate={() => {}} />
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900">₹{Number(order.totalAmount).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Order Items</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-3 border border-slate-100">
                      <img src={item.product.imageUrl} alt={item.product.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-slate-500">{item.quantity} x ₹{Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Shipping Address</p>
                <p className="text-sm text-slate-600">
                  {order.shippingAddress}, {order.shippingCity}, {order.shippingPostalCode}, {order.shippingCountry}
                  <br />
                  Phone: {order.shippingPhone}
                </p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No orders found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
