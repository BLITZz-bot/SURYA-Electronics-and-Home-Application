"use client";

import Link from "next/link";

interface ProductMobileStickyBarProps {
  product: {
    id: string;
    price: number | string;
  };
}

export default function ProductMobileStickyBar({ product }: ProductMobileStickyBarProps) {
  const scrollToActions = (e: React.MouseEvent) => {
    e.preventDefault();
    const actionBox = document.querySelector('button[type="button"]');
    if (actionBox) {
      actionBox.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[45] bg-white border-t border-gray-200 p-3 lg:hidden flex items-center justify-between gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 line-through">
          ₹{Number(Number(product.price) * 1.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        <span className="text-lg font-bold">₹{Number(product.price).toLocaleString()}</span>
      </div>
      <button 
        onClick={scrollToActions}
        className="bg-surya-light text-white px-6 py-2.5 rounded-full text-sm font-extrabold shadow-lg flex-1 text-center active:bg-surya-dark transition-all transform active:scale-95"
      >
        Add to Cart
      </button>
    </div>
  );
}
