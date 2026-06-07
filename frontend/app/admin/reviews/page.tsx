"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/auth-context";
import { getApiUrl } from "../../../lib/api-utils";
import { Star, Trash2, User, Package, ShieldCheck, MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
  const { token, isAdmin } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl("/api/products"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const products = await res.json();
        const allReviews = products.flatMap((p: any) => 
          p.reviews?.map((r: any) => ({ ...r, product: { name: p.name, id: p.id } })) || []
        );
        setReviews(allReviews.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) fetchReviews();
  }, [token, isAdmin, fetchReviews]);

  async function deleteReview(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="py-40 text-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Moderating Feedback...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Customer Feedback</h1>
        <p className="text-sm text-gray-500 font-medium">Monitor and manage product reviews and ratings</p>
      </div>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex flex-col md:flex-row justify-between gap-6">
               <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#0F3D6E]/5 flex items-center justify-center text-[#0F3D6E]">
                        <User size={20} />
                     </div>
                     <div>
                        <p className="font-black text-gray-900">{review.user?.name || "Amazon Customer"}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <div className="flex text-amazon-orange">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
                        ))}
                     </div>
                     <span className="text-sm font-black text-gray-900 ml-2">{review.title}</span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium italic">&quot;{review.description}&quot;</p>
                  
                  <div className="flex items-center gap-3 pt-2">
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0F3D6E] rounded-full border border-blue-100">
                        <Package size={12} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{review.product?.name}</span>
                     </div>
                     {review.isVerified && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                           <ShieldCheck size={12} />
                           <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex md:flex-col justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteReview(review.id)}
                    className="p-4 bg-rose-50 text-rose-300 hover:text-rose-600 hover:bg-rose-100 rounded-2xl transition-all border border-transparent hover:border-rose-200"
                  >
                     <Trash2 size={20} />
                  </button>
               </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
           <div className="py-40 text-center bg-white rounded-[50px] border-2 border-dashed border-gray-100">
              <MessageSquare size={48} className="mx-auto text-gray-100 mb-4" />
              <p className="text-gray-300 font-black text-xl italic">No customer feedback to moderate.</p>
           </div>
        )}
      </div>
    </div>
  );
}
