import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Users, DollarSign, Calendar, Edit } from 'lucide-react';

export default function AdminHR({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [payroll, setPayroll] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  
  const [staffList, setStaffList] = useState<any[]>([]);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [editSalaryId, setEditSalaryId] = useState<string | null>(null);
  const [salaryForm, setSalaryForm] = useState({ userId: '', month: '', baseSalary: '', allowances: '', netPayable: '', status: 'Completed' });
  const [loading, setLoading] = useState(false);

  const fetchPayroll = () => fetch('/api/hr/payroll').then(res => res.json()).then(data => setPayroll(data)).catch(console.error);

  useEffect(() => {
    fetchPayroll();
    fetch('/api/hr/leave').then(res => res.json()).then(data => setLeaves(data)).catch(console.error);
    fetch('/api/staff').then(res => res.json()).then(data => setStaffList(data)).catch(console.error);
  }, []);

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/hr/payroll', {
        method: editSalaryId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...salaryForm, id: editSalaryId })
      });
      if (response.ok) {
        setShowSalaryModal(false);
        fetchPayroll();
      } else {
        alert('Error saving salary record');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSalary = async (id: string) => {
    if (!confirm('Delete this salary record?')) return;
    try {
      const response = await fetch(`/api/hr/payroll?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchPayroll();
    } catch (err) {
      console.error(err);
    }
  };

  const renderSalary = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Employee Salary</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage staff compensation, bonuses, and deductions.</p>
        </div>
        <button onClick={() => {
          setEditSalaryId(null);
          setSalaryForm({ userId: staffList[0]?.id || '', month: 'October 2024', baseSalary: '5000', allowances: '500', netPayable: '5500', status: 'Completed' });
          setShowSalaryModal(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Update Salary
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employee..." 
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
                <th className="p-4 pl-6">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4">Allowances</th>
                <th className="p-4">Net Payable</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payroll.map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{emp.dept}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{emp.base}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{emp.allow}</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">${emp.net}</td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {
                        setEditSalaryId(emp.id);
                        setSalaryForm({
                          userId: '', // Cannot easily edit user for existing record in this simple view
                          month: emp.month,
                          baseSalary: emp.base,
                          allowances: emp.allow,
                          netPayable: emp.net,
                          status: emp.status
                        });
                        setShowSalaryModal(true);
                      }} className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteSalary(emp.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editSalaryId ? 'Edit Salary Record' : 'New Salary Record'}</h3>
              <button onClick={() => setShowSalaryModal(false)} className="text-slate-400 hover:text-slate-500">&times;</button>
            </div>
            <form onSubmit={handleSaveSalary} className="p-6 space-y-4">
              {!editSalaryId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee</label>
                  <select required value={salaryForm.userId} onChange={e => setSalaryForm({...salaryForm, userId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Month</label>
                <input required type="text" value={salaryForm.month} onChange={e => setSalaryForm({...salaryForm, month: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. October 2024" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Salary</label>
                  <input required type="text" value={salaryForm.baseSalary} onChange={e => setSalaryForm({...salaryForm, baseSalary: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Allowances</label>
                  <input required type="text" value={salaryForm.allowances} onChange={e => setSalaryForm({...salaryForm, allowances: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Net Payable</label>
                <input required type="text" value={salaryForm.netPayable} onChange={e => setSalaryForm({...salaryForm, netPayable: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowSalaryModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Payroll Processing</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate payslips and process monthly payouts.</p>
        </div>
        <button onClick={() => alert('Payroll processed successfully for the current month!')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <DollarSign size={18} /> Process Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { month: 'September 2024', total: '$145,200', emps: 42, status: 'Completed' },
          { month: 'October 2024', total: '$146,800', emps: 43, status: 'Pending Review' },
        ].map((pr, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                pr.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' : 
                'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800'
              }`}>
                {pr.status}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="Export">
                <Download size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{pr.month}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{pr.emps} Employees Processed</p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Payout</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{pr.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeave = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Approval</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review and manage employee leave requests.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Employee</th>
                <th className="p-4">Leave Type</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Reason</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaves.map((req, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">
                    {req.name}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {req.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" /> {req.duration}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-sm truncate max-w-[200px]">{req.reason}</td>
                  <td className="p-4 pr-6 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 rounded transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 rounded transition-colors">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-bold rounded ${req.status === 'Approved' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        {req.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'hr-salary':
      return renderSalary();
    case 'hr-payroll':
      return renderPayroll();
    case 'hr-leave':
      return renderLeave();
    default:
      return renderSalary();
  }
}
