"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || "/placeholder-product.png");

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white transition p-4 hover:shadow-lg border border-transparent hover:border-gray-200 h-full"
    >
      <div className="h-48 overflow-hidden bg-white mb-4 flex items-center justify-center p-2">
        <img
          src={imgSrc}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgSrc("/placeholder-product.png")}
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#0F3D6E] line-clamp-2 group-hover:text-orange-700 transition-colors h-10 leading-tight">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 min-h-[16px]">
           {product.totalReviews > 0 ? (
             <>
               <div className="flex text-amazon-orange">
                 {[...Array(5)].map((_, i) => (
                   <svg key={i} className={`w-3 h-3 fill-current ${i < Math.round(product.avgRating) ? '' : 'text-gray-200'}`} viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                   </svg>
                 ))}
               </div>
               <span className="text-xs text-[#5DADE2] font-bold">{product.totalReviews}</span>
             </>
           ) : (
             <span className="text-[10px] text-gray-300 font-bold italic uppercase tracking-tighter">No reviews yet</span>
           )}
        </div>
        <div className="mt-2 min-h-[48px]">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold self-start mt-1">₹</span>
            <span className="text-2xl font-black text-gray-900">{Number(product.price).toLocaleString()}</span>
          </div>
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <p className="text-xs text-gray-400 line-through">₹{Number(product.originalPrice).toLocaleString()}</p>
          )}
        </div>
        
        {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
          <div className="mt-2 flex items-center gap-2">
             <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% Off
             </span>
          </div>
        )}
        
        <p className="mt-auto pt-4 text-[10px] text-emerald-600 font-black uppercase tracking-widest">In Stock</p>
        <p className="text-[10px] text-gray-400 font-bold">Standard Shipping Eligible</p>
      </div>
    </Link>
  );
}
