"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  mainImage: string;
  name: string;
}

export default function ProductImageGallery({ mainImage, name }: ProductImageGalleryProps) {
  const [imgSrc, setImgSrc] = useState(mainImage || "/placeholder-product.png");

  return (
    <div className="space-y-4">
      <div className="sticky top-24 border border-gray-100 rounded-sm p-4 flex items-center justify-center min-h-[400px] bg-white relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-contain transition-transform hover:scale-110 duration-500 cursor-zoom-in"
          onError={() => setImgSrc("/placeholder-product.png")}
        />
      </div>
      {/* Thumbnails - Only show if there's more than one image (future support) or just the main one for now */}
      <div className="flex gap-2 justify-center">
        <div className="w-12 h-12 border-2 border-surya-light rounded-sm p-1 cursor-pointer relative overflow-hidden">
           <Image 
            src={imgSrc} 
            alt="thumbnail" 
            fill
            className="object-contain" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.png";
            }}
          />
        </div>
      </div>
    </div>
  );
}
