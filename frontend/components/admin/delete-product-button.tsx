'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      router.refresh();
    } catch (err) {
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50"
    >
      {isDeleting ? '...' : 'Delete'}
    </button>
  );
}
