"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../../../lib/api-utils";
import { useAuth } from "../../../context/auth-context";
import { 
  Tag, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Search, 
  MoreVertical,
  X,
  CheckCircle2,
  RefreshCcw,
  LayoutGrid
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", image: "" });
  const { token, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token && isAdmin) fetchCategories();
  }, [token, isAdmin]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(getApiUrl("/api/categories"));
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    
    const categoryData = {
      ...newCategory,
      slug: newCategory.slug || newCategory.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    };

    try {
      const res = await fetch(getApiUrl("/api/categories"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create category");
      }

      setNewCategory({ name: "", slug: "", image: "" });
      setIsAdding(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? All products in this category will be detached.")) return;
    if (!token) return;

    try {
      const res = await fetch(getApiUrl(`/api/categories/${id}`), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.ok) fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <RefreshCcw className="h-10 w-10 animate-spin text-[#0F3D6E]" />
        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Syncing Departments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Store Departments</h1>
          <p className="text-sm text-gray-500 font-medium">Categorize your catalog for better customer navigation</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-[#0F3D6E] text-white px-8 py-3 rounded-full font-black shadow-lg shadow-[#0F3D6E]/20 hover:bg-black transition-all flex items-center gap-2 transform active:scale-95"
          >
            <Plus size={20} />
            Create Department
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddCategory} className="bg-white p-10 rounded-[40px] border-2 border-[#0F3D6E]/10 shadow-2xl space-y-8 animate-in slide-in-from-top duration-500">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-black text-[#0F3D6E] uppercase tracking-widest">New Category Details</h2>
             <button type="button" onClick={() => setIsAdding(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Name</label>
              <input
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none"
                placeholder="e.g. Smart Home"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">URL Slug</label>
              <input
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none"
                placeholder="e.g. smart-home"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Visual / Icon URL</label>
              <input
                type="url"
                value={newCategory.image}
                onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}

          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-[#0F3D6E] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#0F3D6E]/20 hover:bg-black transition-all">
              Establish Department
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-200 transition-all">
              Discard
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#0F3D6E]/5 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[80px] -mr-8 -mt-8 group-hover:bg-[#0F3D6E]/5 transition-colors" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center p-4 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <LayoutGrid size={32} className="text-gray-300" />
                  )}
               </div>
               
               <div>
                  <h3 className="text-lg font-black text-gray-900 italic uppercase tracking-tight">{cat.name}</h3>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#5DADE2] mt-1">
                     <LinkIcon size={10} />
                     <span className="uppercase tracking-widest">{cat.slug}</span>
                  </div>
               </div>

               <button 
                onClick={() => handleDeleteCategory(cat.id)}
                className="pt-4 text-xs font-black text-rose-300 hover:text-rose-600 uppercase tracking-[0.2em] transition-colors"
               >
                 Delete Department
               </button>
            </div>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="col-span-full py-40 text-center border-2 border-dashed border-gray-100 rounded-[60px]">
             <Tag size={48} className="mx-auto text-gray-100 mb-4" strokeWidth={3} />
             <p className="text-gray-300 font-black text-xl italic">The store catalog is currently flat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
