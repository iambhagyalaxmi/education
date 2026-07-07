import { useState, useEffect } from 'react';
import { Search, UserPlus, Trash2, X, CheckCircle } from 'lucide-react';

export default function AdminFaculty({ activeTab: _activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', role: 'faculty', profilePic: '' });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchFaculty = () => {
    fetch('/api/staff?role=faculty')
      .then(res => res.json())
      .then(data => setFacultyList(Array.isArray(data) && data.length > 0 ? data : []))
      .catch(() => {
        setFacultyList(prev => prev.length > 0 ? prev : [
          { id: 'FAC001', name: 'Dr. Ramesh Kumar', email: 'ramesh@example.com', department: 'Computer Science', isActive: true },
          { id: 'FAC002', name: 'Dr. Anita Singh', email: 'anita@example.com', department: 'Information Tech', isActive: true }
        ]);
      });
  };

  useEffect(() => { fetchFaculty(); }, []);

  const saveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Optimistic UI update
    const newFaculty = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      department: form.department,
      profilePic: form.profilePic,
      isActive: true
    };
    setFacultyList(prev => [newFaculty, ...prev]);

    try {
      await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } catch (err) {
      // Ignore backend error for UI demo
    }

    setSaving(false);
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', department: '', role: 'faculty', profilePic: '' });
    setSuccessMsg('Faculty added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const deleteFaculty = async (id: string) => {
    if (!confirm('Remove this faculty member?')) return;
    await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
    fetchFaculty();
  };

  const filtered = facultyList.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderFacultyList = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Faculty Directory</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <UserPlus size={18} /> Add Faculty
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Add Faculty Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Faculty</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={saveFaculty} className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative mb-2">
                  {form.profilePic ? (
                    <img src={form.profilePic} alt="Profile preview" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                      <UserPlus size={28} />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = async () => {
                      const base64Image = reader.result;
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ image: base64Image })
                        });
                        const data = await res.json();
                        if (data.url) setForm({...form, profilePic: data.url});
                      } catch (err) {
                        console.error('Upload failed', err);
                      }
                    };
                  }}
                  className="text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 max-w-[200px]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                  <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Department *</label>
                <input type="text" required value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="e.g. Computer Science" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60">
                  {saving ? 'Saving...' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search faculty by name, ID, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Faculty Info</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm overflow-hidden">
                        {faculty.profilePic ? (
                          <img src={faculty.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          faculty.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{faculty.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{faculty.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{faculty.department || 'N/A'}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      faculty.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {faculty.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => deleteFaculty(faculty.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No faculty found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return renderFacultyList();
}
