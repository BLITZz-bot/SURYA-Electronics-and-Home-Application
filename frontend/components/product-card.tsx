"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || "/placeholder-product.png");

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/products/${product.id}`}
        className="group flex flex-col bg-white transition-all p-6 rounded-[32px] border border-gray-100 hover:border-[#0F3D6E]/10 hover:shadow-[0_24px_48px_-12px_rgba(15,61,110,0.12)] h-full relative overflow-hidden"
      >
        <div className="h-56 overflow-hidden bg-gray-50/50 rounded-2xl mb-6 flex items-center justify-center p-4 relative group-hover:bg-white transition-colors duration-500">
          <div className="relative w-full h-full">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-110"
              onError={() => setImgSrc("/placeholder-product.png")}
            />
          </div>
          {/* Discount Badge */}
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg z-10">
               {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 space-y-3">
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase text-[#5DADE2] tracking-widest">{product.brand}</p>
             <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-snug group-hover:text-[#0F3D6E] transition-colors">
               {product.name}
             </h3>
          </div>

          <div className="flex items-center gap-2">
             {product.totalReviews > 0 ? (
               <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-amazon-orange">
                     <Star size={12} fill="currentColor" />
                     <span className="text-xs font-black text-gray-900">{product.avgRating?.toFixed(1) || "0.0"}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">({product.totalReviews})</span>
               </div>
             ) : (
               <span className="text-[10px] text-gray-300 font-bold italic uppercase tracking-tighter">New Arrival</span>
             )}
          </div>

          <div className="pt-2 mt-auto border-t border-gray-50">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-[#0F3D6E]">₹</span>
              <span className="text-xl font-black text-[#0F3D6E] tracking-tight">{Number(product.price).toLocaleString()}</span>
            </div>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <p className="text-[10px] text-gray-400 line-through font-bold">₹{Number(product.originalPrice).toLocaleString()}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse" />
                In Stock
             </span>
             <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#0F3D6E] group-hover:text-white transition-all">
                <ArrowRight size={14} />
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
