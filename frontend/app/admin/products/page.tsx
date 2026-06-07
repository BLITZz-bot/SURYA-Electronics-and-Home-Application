import { prisma } from "../../../lib/prisma";
import AdminProductManager from "../../../components/admin-product-manager";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Product Management</h1>
        <p className="text-slate-500">Add, edit, or remove products from your store inventory.</p>
      </div>

      <AdminProductManager initialProducts={products} />
    </div>
  );
}
