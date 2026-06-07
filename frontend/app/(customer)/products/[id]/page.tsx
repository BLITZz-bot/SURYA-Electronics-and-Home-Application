import { notFound } from "next/navigation";
import Link from "next/link";
import { Ticket } from "lucide-react";
import AddToCartForm from "../../../../components/add-to-cart-form";
import ProductMobileStickyBar from "../../../../components/product-mobile-sticky-bar";
import ProductImageGallery from "../../../../components/product-image-gallery";
import ProductCard from "../../../../components/product-card";
import ReviewSection from "../../../../components/review-section";
import { getApiUrl } from "../../../../lib/api-utils";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product = null;
  let relatedProducts: any[] = [];
  let activeOffers: any[] = [];

  try {
    const [prodRes, offerRes] = await Promise.all([
      fetch(getApiUrl(`/api/products/${params.id}`), { cache: 'no-store' }),
      fetch(getApiUrl(`/api/offers/active`), { cache: 'no-store' })
    ]);

    if (prodRes.ok) product = await prodRes.json();
    if (offerRes.ok) activeOffers = await offerRes.json();
    
    if (product) {
      const relatedRes = await fetch(getApiUrl(`/api/products`), { cache: 'no-store' });
      if (relatedRes.ok) {
        const allProducts = await relatedRes.json();
        relatedProducts = allProducts
          .filter((p: any) => p.categoryId === product.categoryId && p.id !== product.id)
          .slice(0, 4);
      }
    }
  } catch (error) {
    console.error("Product Detail Page Error:", error);
  }

  if (!product) {
    notFound();
  }

  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discountPercentage = hasDiscount ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100) : 0;
  const savings = hasDiscount ? Number(product.originalPrice) - Number(product.price) : 0;

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-[1500px] px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:underline hover:text-orange-700">Home</Link>
        <span>›</span>
        <Link href="/products" className="hover:underline hover:text-orange-700">Electronics</Link>
        <span>›</span>
        <span className="font-bold text-gray-700">{product.category?.name}</span>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 pt-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr_0.8fr]">
          {/* Column 1: Gallery */}
          <ProductImageGallery mainImage={product.imageUrl} name={product.name} />

          {/* Column 2: Details */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <Link href={`/products?brand=${product.brand}`} className="text-sm font-bold text-[#5DADE2] hover:text-orange-700 hover:underline">
                Visit the {product.brand} Store
              </Link>
              <h1 className="text-3xl font-medium mt-1 leading-tight text-gray-900">{product.name}</h1>
              
              <div className="mt-2 flex items-center gap-4">
                 {product.totalReviews > 0 ? (
                   <div className="flex items-center gap-2">
                      <div className="flex text-amazon-orange">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 fill-current ${i < Math.round(product.avgRating) ? '' : 'text-gray-200'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-[#0F3D6E] font-bold hover:text-orange-700 cursor-pointer">{product.avgRating.toFixed(1)}</span>
                      <span className="text-sm text-[#5DADE2] font-bold hover:text-orange-700 cursor-pointer">{product.totalReviews} ratings</span>
                   </div>
                 ) : (
                   <span className="text-sm text-gray-400 font-bold italic">No reviews yet</span>
                 )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                {hasDiscount && <span className="text-3xl text-rose-600 font-light">-{discountPercentage}%</span>}
                <div className="flex items-baseline gap-0.5 text-gray-900">
                  <span className="text-sm font-medium self-start mt-1">₹</span>
                  <span className="text-4xl font-medium">{Number(product.price).toLocaleString()}</span>
                </div>
              </div>
              {hasDiscount && (
                <p className="text-xs text-gray-500">
                  M.R.P: <span className="line-through">₹{Number(product.originalPrice).toLocaleString()}</span>
                </p>
              )}
              {hasDiscount && (
                <p className="text-sm font-bold text-emerald-700 uppercase tracking-tighter">You save ₹{savings.toLocaleString()} ({discountPercentage}%)</p>
              )}
              <p className="text-xs text-gray-700 font-medium">Inclusive of all taxes</p>
            </div>

            {/* Product-Specific Offer Section */}
            {product.offerTitle && (
              <div className="bg-[#0F3D6E]/5 border-2 border-dashed border-[#0F3D6E]/20 p-6 rounded-[32px] animate-in zoom-in duration-500">
                 <div className="flex items-center gap-2 mb-2 text-[#0F3D6E]">
                    <Ticket size={20} className="text-amazon-orange" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">{product.offerTitle}</span>
                 </div>
                 <p className="text-sm font-bold text-gray-700 leading-relaxed">{product.offerDescription}</p>
              </div>
            )}

            {/* Global Active Offers Section */}
            {activeOffers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-6 border-y border-gray-100">
                 {activeOffers.map(offer => (
                   <OfferCard key={offer.id} title={offer.title} description={offer.description} type={offer.type} />
                 ))}
              </div>
            )}

            {/* About Section */}
            <div className="space-y-4">
               <h3 className="font-bold text-lg">About this item</h3>
               <p className="text-sm text-gray-700 leading-relaxed text-justify whitespace-pre-line">{product.description}</p>
               <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mt-6">
                 <table className="w-full text-sm text-left">
                    <tbody>
                      <tr><td className="py-2 pr-4 font-bold text-gray-500 w-1/3 uppercase text-[10px] tracking-widest">Brand</td><td className="py-2 text-gray-900 font-bold">{product.brand}</td></tr>
                      <tr className="border-t border-gray-200"><td className="py-2 pr-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Model</td><td className="py-2 text-gray-900 font-medium">{product.name}</td></tr>
                      <tr className="border-t border-gray-200"><td className="py-2 pr-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Category</td><td className="py-2 text-gray-900 font-medium">{product.category?.name}</td></tr>
                      <tr className="border-t border-gray-200"><td className="py-2 pr-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Availability</td><td className={`py-2 font-black ${product.stock > 0 ? "text-emerald-600" : "text-rose-600"}`}>{product.stock > 0 ? "In Stock" : "Currently Unavailable"}</td></tr>
                    </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Column 3: Actions */}
          <div className="space-y-4">
            <AddToCartForm productId={product.id} availableStock={product.stock} price={product.price} />
          </div>
        </div>

        {/* Mobile Sticky Bar */}
        <ProductMobileStickyBar product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Similar items you might like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Real Customer Reviews Section */}
        <ReviewSection 
          productId={product.id} 
          reviews={product.reviews} 
          avgRating={product.avgRating} 
          totalReviews={product.totalReviews} 
          ratingBreakdown={product.ratingBreakdown}
        />
      </div>
    </main>
  );
}

function OfferCard({ title, description, type }: { title: string, description: string, type: string }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col hover:bg-gray-50 cursor-pointer transition-all border-l-4 border-l-[#0F3D6E]">
       <span className="text-xs font-black text-[#0F3D6E] uppercase tracking-widest mb-1">{type} Offer</span>
       <span className="text-sm font-bold text-gray-900 line-clamp-1">{title}</span>
       <span className="text-[11px] text-gray-600 mt-2 line-clamp-2 leading-relaxed">{description}</span>
       <span className="text-[10px] text-[#5DADE2] font-black mt-auto pt-3 uppercase tracking-tighter">View Details ›</span>
    </div>
  );
}
