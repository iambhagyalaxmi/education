import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Users, DollarSign, Calendar, Edit } from 'lucide-react';

export default function AdminHR({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [payroll, setPayroll] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/hr/payroll').then(res => res.json()).then(data => setPayroll(data)).catch(console.error);
    fetch('/api/hr/leave').then(res => res.json()).then(data => setLeaves(data)).catch(console.error);
  }, []);

  const renderSalary = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Employee Salary</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage staff compensation, bonuses, and deductions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{emp.net}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Payroll Processing</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate payslips and process monthly payouts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
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
