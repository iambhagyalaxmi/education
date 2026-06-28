import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Eye, EyeOff, LayoutGrid } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string | null;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function GalleryDashboard() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryImage>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  const categories = ['Hero', 'Campus', 'Featured', 'Slider'];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery?all=true');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch images:', e);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setImages(images.filter(img => img.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (id?: string) => {
    try {
      const isNew = !id;
      const method = isNew ? 'POST' : 'PUT';
      const body = JSON.stringify(isNew ? editForm : { ...editForm, id });

      const res = await fetch('/api/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const data = await res.json();
      
      if (isNew) {
        setImages([data, ...images]);
        setIsAdding(false);
      } else {
        setImages(images.map(img => img.id === id ? data : img));
        setIsEditing(null);
      }
      setEditForm({});
    } catch (e) {
      console.error(e);
    }
  };

  const toggleActive = async (image: GalleryImage) => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...image, isActive: !image.isActive })
      });
      const data = await res.json();
      setImages(images.map(img => img.id === image.id ? data : img));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredImages = activeCategoryFilter === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategoryFilter);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Gallery Management</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Manage hero banners, sliders, and campus highlights</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditForm({ category: 'Campus', isActive: true, order: 0 });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategoryFilter('All')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeCategoryFilter === 'All' 
              ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategoryFilter === cat 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isAdding && (
        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Add New Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Image URL" 
              value={editForm.url || ''} 
              onChange={e => setEditForm({...editForm, url: e.target.value})}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
            />
            <input 
              type="text" 
              placeholder="Title" 
              value={editForm.title || ''} 
              onChange={e => setEditForm({...editForm, title: e.target.value})}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
            />
            <input 
              type="text" 
              placeholder="Description" 
              value={editForm.description || ''} 
              onChange={e => setEditForm({...editForm, description: e.target.value})}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
            />
            <div className="flex gap-4">
              <select 
                value={editForm.category || 'Campus'}
                onChange={e => setEditForm({...editForm, category: e.target.value})}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input 
                type="number" 
                placeholder="Order" 
                value={editForm.order || 0} 
                onChange={e => setEditForm({...editForm, order: parseInt(e.target.value)})}
                className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
            <button onClick={() => handleSave()} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 rounded-lg flex items-center gap-2">
              <Save size={16} /> Save Image
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(img => (
            <div key={img.id} className={`group rounded-xl border transition-all duration-300 overflow-hidden ${img.isActive ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800' : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 opacity-80'}`}>
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded">
                    {img.category}
                  </span>
                </div>
                {!img.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5">
                      <EyeOff size={14} /> Hidden
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {isEditing === img.id ? (
                  <div className="space-y-3">
                    <input type="text" value={editForm.url} onChange={e => setEditForm({...editForm, url: e.target.value})} className="w-full text-xs p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="URL" />
                    <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full text-sm font-semibold p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Title" />
                    <input type="text" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full text-xs p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Description" />
                    <div className="flex gap-2">
                      <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="flex-1 text-xs p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input type="number" value={editForm.order} onChange={e => setEditForm({...editForm, order: parseInt(e.target.value)})} className="w-16 text-xs p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Order" />
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <button onClick={() => handleSave(img.id)} className="flex-1 bg-emerald-600 text-white text-xs py-2 rounded font-semibold hover:bg-emerald-700">Save</button>
                      <button onClick={() => setIsEditing(null)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs py-2 rounded font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{img.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[32px]">{img.description}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        Order: <span className="text-slate-800 dark:text-slate-300">{img.order}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => toggleActive(img)} title={img.isActive ? "Hide image" : "Show image"} className={`p-1.5 rounded-md transition-colors ${img.isActive ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                          {img.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button onClick={() => { setIsEditing(img.id); setEditForm(img); }} className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(img.id)} className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
