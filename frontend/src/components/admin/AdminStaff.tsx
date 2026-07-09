import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Shield, Edit, Trash2, ShieldAlert, Key } from 'lucide-react';

export default function AdminStaff({ activeTab, setActiveTab }: { activeTab: string, setActiveTab?: (tab: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: ''
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff', { 
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } 
      });
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      console.error(err);
      // Fallback data if backend is down
      setStaffList([
        { id: 'STF001', name: 'John Smith', role: 'System Admin', department: 'IT Support', email: 'john.s@institute.edu', status: 'Active' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, [activeTab]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const isEditing = !!editingId;
      
      // Optimistic UI update for immediate feedback
      if (isEditing) {
        setStaffList(prev => prev.map(s => s.id === editingId ? { ...s, ...formData } : s));
      } else {
        const optimisticStaff = { id: 'temp-' + Date.now(), ...formData, status: 'Active' };
        setStaffList(prev => [optimisticStaff, ...prev]);
      }

      const url = isEditing ? `/api/staff?id=${editingId}` : '/api/staff';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(isEditing ? 'Failed to update staff' : 'Registration failed');
      
      setSuccessMsg(isEditing ? 'Staff member updated successfully!' : 'Staff member registered successfully!');
      setFormData({ name: '', email: '', phone: '', role: '', department: '' });
      setEditingId(null);
      fetchStaff();
      if (setActiveTab) setActiveTab('staff-list');
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)));
    }
  };

  const handleEdit = (staff: any) => {
    setEditingId(staff.id);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || '',
      role: staff.role,
      department: staff.department || ''
    });
    if (setActiveTab) setActiveTab('staff-add');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const renderStaffList = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Staff Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage non-teaching staff across all departments.</p>
        </div>
        <button onClick={() => setActiveTab && setActiveTab('staff-add')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Staff
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff by name, role, or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Staff Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{staff.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{staff.role}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{staff.id}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {staff.department}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(staff)} className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(staff.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
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

  const renderAddStaff = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {editingId ? 'Edit Staff Member' : 'Staff Registration Form'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {editingId ? 'Update details for this staff member.' : 'Enter details to onboard a new staff member.'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8">
        {error && <div className="p-4 mb-6 bg-rose-50 text-rose-700 rounded-lg">{error}</div>}
        {successMsg && <div className="p-4 mb-6 bg-emerald-50 text-emerald-700 rounded-lg">{successMsg}</div>}
        
        <form className="space-y-8" onSubmit={handleRegister}>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="jane.doe@institute.edu" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Birth *</label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Department *</label>
                <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                  <option value="">Select Department</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Library">Library</option>
                  <option value="Facilities">Facilities & Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Role/Designation *</label>
                <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. System Admin" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => {
              setError(''); 
              setSuccessMsg(''); 
              setFormData({name: '', email: '', phone: '', role: '', department: ''});
              setEditingId(null);
              if (setActiveTab) setActiveTab('staff-list');
            }} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
              {loading ? 'Registering...' : (editingId ? 'Update Staff' : 'Register Staff')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Roles & Permissions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure access control levels for different staff roles.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <ShieldAlert size={18} /> New Role
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { role: 'Super Admin', desc: 'Full access to all modules and settings.', users: 2, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
          { role: 'Academic Admin', desc: 'Manage courses, students, and exams.', users: 5, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
          { role: 'Finance Admin', desc: 'Access to fees, salary, and reports.', users: 3, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { role: 'HR Manager', desc: 'Manage staff, leaves, and payroll.', users: 2, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { role: 'Librarian', desc: 'Manage books and digital library.', users: 4, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { role: 'Support Staff', desc: 'Basic access to own profile and leaves.', users: 45, color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                {i === 0 ? <Key size={24} /> : <Shield size={24} />}
              </div>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={18} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{item.role}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">{item.desc}</p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Assigned Users</span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm">{item.users}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'staff-list':
      return renderStaffList();
    case 'staff-add':
      return renderAddStaff();
    case 'staff-roles':
      return renderRoles();
    default:
      return renderStaffList();
  }
}
