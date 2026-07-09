import { useState, useEffect } from 'react';
import { Search, Filter, Download, UserPlus, CheckCircle, XCircle, Clock, X, Edit2 } from 'lucide-react';

export default function AdminAdmissions({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ appId: '', name: '', course: '', date: '', score: '', status: 'Pending' });

  const openEditModal = (app: any) => {
    setForm({
      appId: app.appId || '',
      name: app.name || '',
      course: app.course || '',
      date: app.date || '',
      score: app.score || '',
      status: app.status || 'Pending'
    });
    setEditingId(app.id);
    setShowModal(true);
  };

  const fetchApplications = () => {
    fetch('/api/admissions').then(res => res.json()).then(data => setApplications(Array.isArray(data) ? data : [])).catch(console.error);
  };

  useEffect(() => { fetchApplications(); }, []);

  const updateStatus = async (id: string, status: string) => {
    // Optimistic UI update for demo purposes
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    try {
      await fetch(`/api/admissions?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    } catch (e) {
      console.log('Backend sync failed, using local state');
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingId) {
        setApplications(prev => prev.map(a => a.id === editingId ? { ...form, id: editingId } : a));
        await fetch(`/api/admissions?id=${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      } else {
        const newApp = { ...form, id: Date.now().toString() };
        setApplications(prev => [newApp, ...prev]);
        await fetch('/api/admissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
    } catch (e) {
      console.log('Backend sync failed, using local state');
    }
    
    setSaving(false);
    setShowModal(false);
    setEditingId(null);
    setForm({ appId: '', name: '', course: '', date: '', score: '', status: 'Pending' });
  };

  const renderNewApplications = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">New Applications</h2>
        <div className="flex gap-2">
          <button onClick={() => { setEditingId(null); setForm({ appId: '', name: '', course: '', date: '', score: '', status: 'Pending' }); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <UserPlus size={18} /> New Application
          </button>
        </div>
      </div>

      {/* Add Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editingId ? 'Edit Application' : 'New Admission Application'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={submitApplication} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Application ID *</label>
                  <input type="text" required value={form.appId} onChange={e => setForm({...form, appId: e.target.value})} placeholder="APP-2024-001" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Applicant Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Course Applied *</label>
                <input type="text" required value={form.course} onChange={e => setForm({...form, course: e.target.value})} placeholder="e.g. B.Tech Computer Science" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Application Date *</label>
                  <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Score / %</label>
                  <input type="text" value={form.score} onChange={e => setForm({...form, score: e.target.value})} placeholder="e.g. 85%" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60">
                  {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Submit Application')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {applications.filter(a => a.status === 'Pending').length} pending applications
          </h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Download size={16} /> Export
            </button>
          </div>
        </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Application ID</th>
                <th className="p-4">Applicant Name</th>
                <th className="p-4">Course Applied</th>
                <th className="p-4">Date</th>
                <th className="p-4">Score</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.filter(app => app.status === 'Pending').map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4 pl-6 font-medium text-slate-800 dark:text-slate-200">{app.appId}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {app.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{app.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{app.course}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{app.date}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{app.score}</td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateStatus(app.id, 'Approved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors" title="Approve">
                        <CheckCircle size={18} />
                      </button>
                      <button onClick={() => updateStatus(app.id, 'Rejected')} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Reject">
                        <XCircle size={18} />
                      </button>
                      <button onClick={() => openEditModal(app)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {applications.filter(app => app.status === 'Pending').length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No pending applications found. Click "New Application" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdmissionStatus = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admission Status Tracker</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center"><Clock size={24} /></div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Review</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{applications.filter(a => a.status === 'Pending').length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center"><CheckCircle size={24} /></div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Approved</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{applications.filter(a => a.status === 'Approved').length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center"><XCircle size={24} /></div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Rejected</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{applications.filter(a => a.status === 'Rejected').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Course</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-800 dark:text-slate-200">{app.appId}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{app.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{app.course}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      app.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right text-slate-500 text-sm">
                    {app.status === 'Approved' ? 'Meets criteria' : app.status === 'Rejected' ? 'Low score' : 'In review'}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No applications found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEnrollment = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Enrollment Finalization</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-900/10">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
            The following applicants have been approved and are pending final fee payment and enrollment.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Course</th>
                <th className="p-4">Fee Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.filter(app => app.status === 'Approved').map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-800 dark:text-slate-200">{app.appId}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{app.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{app.course}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Approved
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="px-3 py-1.5 text-sm font-bold rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-700">
                      Enroll Student
                    </button>
                  </td>
                </tr>
              ))}
              {applications.filter(app => app.status === 'Approved').length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No approved applications waiting for enrollment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'admissions-new':
      return renderNewApplications();
    case 'admissions-status':
      return renderAdmissionStatus();
    case 'admissions-enrollment':
      return renderEnrollment();
    default:
      return renderNewApplications();
  }
}
