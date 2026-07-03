import { useState } from 'react';
import { Search, Filter, Plus, Book, Upload, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';

export default function AdminLibrary({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderBooks = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Library Books Catalog</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage physical book inventory and acquisitions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add New Book
        </button>
      </div>

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
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Book Title & Author</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Category</th>
                <th className="p-4">Available Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', cat: 'Computer Science', qty: 12, status: 'In Stock' },
                { title: 'Engineering Mechanics', author: 'S.S. Bhavikatti', isbn: '978-8122423747', cat: 'Mechanical', qty: 4, status: 'Low Stock' },
                { title: 'Advanced Calculus', author: 'Patrick M. Fitzpatrick', isbn: '978-0821847916', cat: 'Mathematics', qty: 0, status: 'Out of Stock' },
              ].map((book, i) => (
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
                  <td className="p-4 text-slate-600 dark:text-slate-400">{book.cat}</td>
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
                      <button className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
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
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{item.cat}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {item.type}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'library-books':
      return renderBooks();
    case 'library-digital':
      return renderDigital();
    default:
      // Issue/Return Books placeholder or just renderBooks for now
      return renderBooks();
  }
}
