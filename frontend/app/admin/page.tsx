import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AdminProductForm from "../../components/admin-product-form";
import AdminOrderStatus from "../../components/admin-order-status";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
          <h1 className="text-3xl font-semibold">Admin access required</h1>
          <p className="mt-4 text-slate-600">You must sign in with an admin account to manage products and orders.</p>
        </div>
      </main>
    );
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

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
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
          <h1 className="text-3xl font-semibold">Admin dashboard</h1>
          <p className="mt-2 text-slate-600">Manage products, inventory, and order status for SURYA Electronics.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_0.6fr]">
          <div className="space-y-6">
            <AdminProductForm />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Products</h2>
              <div className="mt-4 space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-600">Stock: {product.stock}</p>
                      </div>
                      <p className="font-semibold text-slate-900">₹{product.price.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Latest orders</h2>
              <div className="mt-4 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">Order {order.id}</p>
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">{order.status}</span>
                      </div>
                      <p className="text-sm text-slate-600">Customer: {order.user.email}</p>
                      <p className="text-sm text-slate-600">Total: ₹{order.totalAmount.toFixed(0)}</p>
                      <AdminOrderStatus orderId={order.id} currentStatus={order.status} onUpdate={() => window.location.reload()} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
