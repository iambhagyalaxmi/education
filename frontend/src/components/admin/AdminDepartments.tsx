import { useState, useEffect } from 'react';
import { Search, Download, Plus, Building2, Edit, Trash2, X, CheckCircle } from 'lucide-react';

export default function AdminDepartments({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState({ name: '', code: '', hod: '', faculty: '', students: '', status: 'Active' });
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDepts = () => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => { fetchDepts(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', code: '', hod: '', faculty: '', students: '', status: 'Active' });
    setShowModal(true);
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEdit = (dept: any) => {
    setEditTarget(dept);
    setForm({ name: dept.name, code: dept.code, hod: dept.hod || '', faculty: String(dept.faculty), students: String(dept.students), status: dept.status });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
  };

  const saveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, faculty: parseInt(form.faculty) || 0, students: parseInt(form.students) || 0 };
    if (editTarget) {
      await fetch(`/api/departments?id=${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch('/api/departments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setSaving(false);
    setSuccessMsg(editTarget ? 'Department updated!' : 'Department added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    closeModal();
    fetchDepts();
  };

  const deleteDept = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    await fetch(`/api/departments?id=${id}`, { method: 'DELETE' });
    fetchDepts();
  };

  const exportCSV = () => {
    const rows = [['Name', 'Code', 'HOD', 'Faculty', 'Students', 'Status'],
      ...departments.map(d => [d.name, d.code, d.hod || '', d.faculty, d.students, d.status])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'departments.csv';
    a.click();
  };

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.hod || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderList = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Department List</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage all academic departments across the institute.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or HOD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Department Name</th>
                <th className="p-4">Code</th>
                <th className="p-4">Head of Dept</th>
                <th className="p-4">Faculty</th>
                <th className="p-4">Students</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 dark:text-slate-600">
                    <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No departments found.</p>
                    <p className="text-sm mt-1">Click <strong>+ Add Department</strong> to get started.</p>
                  </td>
                </tr>
              ) : filtered.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Building2 size={20} />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{dept.name}</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600 dark:text-slate-400">{dept.code}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{dept.hod || '—'}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{dept.faculty}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{dept.students}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      dept.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(dept)}
                        className="p-1.5 text-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteDept(dept.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
                        title="Delete"
                      >
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
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editTarget ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveDept} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Department Name *</label>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Civil Engineering"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Department Code *</label>
                  <input
                    type="text" required
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g. CE"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Head of Department (HOD)</label>
                <input
                  type="text"
                  value={form.hod}
                  onChange={e => setForm({ ...form, hod: e.target.value })}
                  placeholder="e.g. Dr. John Smith"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Faculty Count</label>
                  <input
                    type="number" min="0"
                    value={form.faculty}
                    onChange={e => setForm({ ...form, faculty: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Student Count</label>
                  <input
                    type="number" min="0"
                    value={form.students}
                    onChange={e => setForm({ ...form, students: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editTarget ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  switch (activeTab) {
    case 'dept-list':
    case 'dept-add':
    default:
      return renderList();
  }
}
