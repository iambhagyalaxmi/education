import { useState, useEffect } from 'react';
import { Search, Plus, Book, Upload, Link as LinkIcon, Edit, Trash2, X, CheckCircle } from 'lucide-react';

export default function AdminLibrary({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', qty: '', status: 'In Stock' });
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBooks = () => {
    fetch('/api/library').then(res => res.json()).then(data => setBooks(Array.isArray(data) ? data : [])).catch(console.error);
  };

  useEffect(() => { fetchBooks(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ title: '', author: '', isbn: '', category: '', qty: '', status: 'In Stock' });
    setShowModal(true);
  };

  const openEdit = (book: any) => {
    setEditTarget(book);
    setForm({ title: book.title, author: book.author, isbn: book.isbn, category: book.category, qty: String(book.qty), status: book.status });
    setShowModal(true);
  };

  const saveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, qty: parseInt(form.qty) || 1 };
    if (editTarget) {
      await fetch(`/api/library?id=${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch('/api/library', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setSaving(false);
    setSuccessMsg(editTarget ? 'Book updated!' : 'Book added to catalog!');
    setTimeout(() => setSuccessMsg(''), 3000);
    setShowModal(false);
    setEditTarget(null);
    fetchBooks();
  };

  const deleteBook = async (id: string) => {
    if (!confirm('Remove this book from the catalog?')) return;
    await fetch(`/api/library?id=${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm)
  );

  const renderBooks = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Library Books Catalog</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage physical book inventory and acquisitions.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Book
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
          <span className="text-sm text-slate-400 font-medium">{filtered.length} book{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Book Title & Author</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Category</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 dark:text-slate-600">
                    <Book size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No books found.</p>
                    <p className="text-sm mt-1">Click <strong>+ Add New Book</strong> to populate the catalog.</p>
                  </td>
                </tr>
              ) : filtered.map((book, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Book size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{book.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-400">{book.isbn}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{book.category}</td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{book.qty}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      book.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                      book.status === 'Low Stock' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(book)} className="p-1.5 text-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteBook(book.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editTarget ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveBook} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Book Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Introduction to Algorithms" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Author *</label>
                <input type="text" required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="e.g. Thomas H. Cormen" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ISBN *</label>
                  <input type="text" required value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} placeholder="978-..." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                  <input type="text" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Computer Science" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantity</label>
                  <input type="number" min="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} placeholder="1" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm">
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60">
                  {saving ? 'Saving...' : editTarget ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderDigital = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Digital E-Library</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage e-books, research papers, and external digital links.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Upload size={18} /> Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Machine Learning Basics', type: 'PDF Document', size: '15.4 MB', cat: 'Computer Science' },
          { title: 'Structural Analysis Vol 2', type: 'eBook (EPUB)', size: '8.2 MB', cat: 'Civil Engg' },
          { title: 'Harvard Business Review 2023', type: 'External Link', size: '-', cat: 'Management' },
          { title: 'Quantum Computing Notes', type: 'PDF Document', size: '3.1 MB', cat: 'Physics' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {item.type.includes('Link') ? <LinkIcon size={24} /> : <Book size={24} />}
              </div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{item.cat}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{item.type}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'library-books': return renderBooks();
    case 'library-digital': return renderDigital();
    default: return renderBooks();
  }
}
