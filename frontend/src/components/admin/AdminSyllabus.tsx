import { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Trash2, X, CheckCircle, ChevronDown, List } from 'lucide-react';

export default function AdminSyllabus() {
  const [syllabuses, setSyllabuses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [form, setForm] = useState({ subjectId: '', title: '', description: '', topics: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [syllabusRes, subjectsRes] = await Promise.all([
        fetch(`/api/syllabus?t=${Date.now()}`),
        fetch(`/api/subjects?t=${Date.now()}`)
      ]);
      
      if (syllabusRes.ok) {
        const data = await syllabusRes.json();
        setSyllabuses(data);
      }
      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let parsedTopics = [];
      try {
        parsedTopics = JSON.parse(form.topics);
        if (!Array.isArray(parsedTopics)) throw new Error('Not an array');
      } catch (e) {
        // Fallback: split by newline if they just typed a list
        parsedTopics = form.topics.split('\n').filter(t => t.trim() !== '');
      }

      const payload = {
        subjectId: form.subjectId,
        title: form.title,
        description: form.description,
        topics: parsedTopics
      };

      const isEditing = !!editingId;
      const url = isEditing ? `/api/syllabus?id=${editingId}` : '/api/syllabus';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save syllabus');
      }

      setSuccess(`Syllabus ${isEditing ? 'updated' : 'added'} successfully!`);
      setShowModal(false);
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (syllabus: any) => {
    setForm({
      subjectId: syllabus.subjectId,
      title: syllabus.title,
      description: syllabus.description || '',
      topics: Array.isArray(syllabus.topics) ? syllabus.topics.join('\n') : ''
    });
    setEditingId(syllabus.id);
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this syllabus?')) return;
    try {
      const res = await fetch(`/api/syllabus?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete syllabus');
      setSuccess('Syllabus deleted successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ subjectId: '', title: '', description: '', topics: '' });
    setEditingId(null);
    setShowModal(true);
    setError('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Syllabus Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Manage course structures, topics, and learning materials.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Syllabus</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-3 border border-emerald-200 dark:border-emerald-800 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Grid of Syllabi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {syllabuses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p>No syllabi found. Create one to get started!</p>
          </div>
        ) : (
          syllabuses.map((syllabus) => (
            <div key={syllabus.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {syllabus.title}
                  </h3>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 mt-2">
                    Subject: {syllabus.subject?.name || 'Unknown'} ({syllabus.subject?.code})
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(syllabus)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-700/50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(syllabus.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 dark:bg-slate-700/50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {syllabus.description}
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5" /> Topics Covered
                </h4>
                <ul className="space-y-2">
                  {Array.isArray(syllabus.topics) && syllabus.topics.slice(0, 3).map((topic: string, i: number) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                      <span>{topic}</span>
                    </li>
                  ))}
                  {Array.isArray(syllabus.topics) && syllabus.topics.length > 3 && (
                    <li className="text-xs text-indigo-600 font-medium pl-3.5">
                      + {syllabus.topics.length - 3} more topics
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Syllabus' : 'Add New Syllabus'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">Target Subject</label>
                  <div className="relative">
                    <select
                      required
                      value={form.subjectId}
                      onChange={e => setForm({...form, subjectId: e.target.value})}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none text-sm"
                    >
                      <option value="">Select a Subject...</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">Syllabus Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="e.g., Complete Java Backend Syllabus"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">Description</label>
                  <textarea
                    rows={1}
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Brief description of the syllabus goals..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                    Topics (One per line)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.topics}
                    onChange={e => setForm({...form, topics: e.target.value})}
                    placeholder="Introduction to Programming&#10;Variables and Data Types&#10;Control Structures"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Syllabus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
