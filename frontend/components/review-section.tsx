/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { getApiUrl } from "../lib/api-utils";
import Link from "next/link";

interface ReviewSectionProps {
  productId: string;
  reviews: any[];
  avgRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
}

export default function ReviewSection({ 
  productId, 
  reviews: initialReviews = [], 
  avgRating = 0, 
  totalReviews = 0, 
  ratingBreakdown = {} 
}: ReviewSectionProps) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [sortBy, setSortBy] = useState("latest");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const sortedReviews = [...safeReviews].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(getApiUrl("/api/reviews"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ ...form, productId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      const newReview = await res.json();
      setReviews([newReview, ...safeReviews]);
      setShowReviewForm(false);
      setForm({ rating: 5, title: "", description: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-20 border-t border-gray-200 pt-10 grid gap-10 lg:grid-cols-[1fr_2.5fr]">
      {/* Sidebar: Summary */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex text-amazon-orange">
             {[...Array(5)].map((_, i) => (
               <svg key={i} className={`w-6 h-6 fill-current ${i < Math.round(Number(avgRating)) ? '' : 'text-gray-200'}`} viewBox="0 0 20 20">
                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
               </svg>
             ))}
          </div>
          <span className="text-lg font-bold">{Number(avgRating).toFixed(1)} out of 5</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Based on {totalReviews} global ratings</p>

        {/* Rating Breakdown */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(star => {
            const count = (ratingBreakdown as any)[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-4 text-sm group cursor-pointer">
                <span className="text-[#0F3D6E] font-bold w-12 hover:underline">{star} star</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                  <div className="h-full bg-amazon-orange transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="text-gray-500 font-bold w-8">{Math.round(percentage)}%</span>
              </div>
            );
          })}
        </div>

        <div className="pt-8 border-t">
          <h3 className="font-bold text-lg mb-2">Review this product</h3>
          <p className="text-sm text-gray-600 mb-6 font-medium">Share your thoughts with other customers</p>
          {user ? (
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full bg-white border border-gray-300 rounded-lg py-2 text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              Write a customer review
            </button>
          ) : (
            <Link href="/auth/signin" className="block w-full text-center bg-white border border-gray-300 rounded-lg py-2 text-sm font-bold shadow-sm hover:bg-gray-50">
              Sign in to write a review
            </Link>
          )}
        </div>
      </div>

      {/* Main Area: List & Form */}
      <div className="space-y-10">
        {showReviewForm && (
          <div className="bg-gray-50 p-8 rounded-3xl border-2 border-[#0F3D6E]/10 animate-in slide-in-from-top duration-500">
            <h3 className="text-xl font-bold mb-6 text-[#0F3D6E]">Create Review</h3>
            {error && <p className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm font-bold mb-6 border border-rose-100">{error}</p>}
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setForm({...form, rating: s})} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${form.rating >= s ? 'bg-amazon-orange text-white shadow-lg' : 'bg-white text-gray-300 border border-gray-100'}`}>
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Add a headline</label>
                <input required placeholder="What's most important to know?" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0F3D6E] outline-none transition-all shadow-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Add a written review</label>
                <textarea required rows={5} placeholder="What did you like or dislike? What did you use this product for?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0F3D6E] outline-none transition-all shadow-sm" />
              </div>
              <div className="flex gap-4">
                <button disabled={submitting} type="submit" className="bg-[#0F3D6E] text-white px-10 py-3 rounded-full font-bold shadow-xl hover:bg-black transition-all active:scale-95 disabled:bg-gray-400">
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="bg-white border border-gray-300 text-gray-600 px-10 py-3 rounded-full font-bold">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="flex items-center justify-between border-b pb-4">
           <h3 className="font-bold text-lg">Top reviews from India</h3>
           <select 
             value={sortBy} 
             onChange={e => setSortBy(e.target.value)}
             className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-[#0F3D6E] outline-none"
           >
              <option value="latest">Sort by Latest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
           </select>
        </div>

        <div className="space-y-10 divide-y divide-gray-50">
          {sortedReviews.length > 0 ? sortedReviews.map((review) => (
            <div key={review.id} className="pt-10 first:pt-0 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                   {review.user.image ? <img src={review.user.image} alt="" className="w-full h-full object-cover" /> : <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
                </div>
                <span className="text-sm font-bold text-gray-900">{review.user.name || "Amazon Customer"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex text-amazon-orange">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} className={`w-4 h-4 fill-current ${i < review.rating ? '' : 'text-gray-200'}`} viewBox="0 0 20 20">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                   ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{review.title}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium italic">Reviewed in India on {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              {review.isVerified && <p className="text-xs font-black text-amazon-orange uppercase tracking-tighter">Verified Purchase</p>}
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{review.description}</p>
              
              <div className="flex items-center gap-4 pt-2">
                 <button className="bg-white border border-gray-300 rounded-lg px-6 py-1.5 text-xs font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95">Helpful</button>
                 <span className="text-xs text-gray-400 font-medium">|</span>
                 <button className="text-xs text-gray-400 hover:text-[#0F3D6E] font-medium">Report</button>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center text-gray-400 italic bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               No customer reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
