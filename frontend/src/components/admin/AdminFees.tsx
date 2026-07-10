import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, DollarSign, CreditCard, AlertCircle, Award, Edit, Trash2, X } from 'lucide-react';

export default function AdminFees({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [feeRecords, setFeeRecords] = useState<any[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    student: '', course: '', amount: '', dueDate: '', status: 'Pending', invoiceNo: ''
  });

  const fetchFees = () => {
    fetch('/api/fees').then(res => res.json()).then(data => setFeeRecords(Array.isArray(data) ? data : [])).catch(console.error);
  };

  useEffect(() => {
    fetchFees();
  }, [activeTab]);

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/fees?id=${editingId}` : '/api/fees';
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert("Error saving record: " + (data.error || 'Check invoice number uniqueness.'));
        setIsSubmitting(false);
        return;
      }

      setShowModal(false);
      fetchFees();
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please ensure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteFee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    await fetch(`/api/fees?id=${id}`, { method: 'DELETE' });
    fetchFees();
  };

  const openAddModal = () => {
    setForm({ student: '', course: '', amount: '', dueDate: '', status: 'Paid', invoiceNo: `INV-${Date.now()}` });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (record: any) => {
    setForm({ student: record.student, course: record.course, amount: record.amount, dueDate: record.dueDate, status: record.status, invoiceNo: record.invoiceNo });
    setEditingId(record.id);
    setShowModal(true);
  };

  const renderStructure = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Fee Structure</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure tuition, hostel, and miscellaneous fee structures.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> New Fee Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { program: 'B.Tech CS / IT', tuition: '$4,500', lab: '$500', library: '$150', total: '$5,150' },
          { program: 'B.Tech Mechanical', tuition: '$4,200', lab: '$800', library: '$150', total: '$5,150' },
          { program: 'BBA', tuition: '$3,800', lab: '$0', library: '$200', total: '$4,000' },
        ].map((fee, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800">
                Annual Fee
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4">{fee.program}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Tuition Fee</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{fee.tuition}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Lab & Equipment</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{fee.lab}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Library & Resources</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{fee.library}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Total</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{fee.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCollection = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Fee Collection Records</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage student fee payments and receipts.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <DollarSign size={18} /> Record Payment
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student name, ID, or receipt..." 
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Receipt No.</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {feeRecords.filter(r => r.status === 'Paid' && (r.student.toLowerCase().includes(searchTerm.toLowerCase()) || r.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()))).map((record, i) => (
                <tr key={record.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{record.student}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.course}</p>
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600 dark:text-slate-400">{record.invoiceNo}</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{record.amount}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-slate-400" /> Bank Transfer
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{record.dueDate}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(record)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteFee(record.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
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

  const renderPending = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Pending Fees & Defaulters</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track outstanding balances and send reminders.</p>
        </div>
        <button onClick={() => { setForm({ student: '', course: '', amount: '', dueDate: '', status: 'Pending', invoiceNo: `INV-${Date.now()}` }); setEditingId(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          <AlertCircle size={18} /> Add Pending Record
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Program</th>
                <th className="p-4">Total Due</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {feeRecords.filter(r => r.status === 'Pending' || r.status === 'Overdue').map((record, i) => (
                <tr key={record.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{record.student}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.invoiceNo}</p>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{record.course}</td>
                  <td className="p-4 font-bold text-orange-600 dark:text-orange-400">{record.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      record.status === 'Overdue' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>{record.dueDate}</span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(record)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteFee(record.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
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

  const renderScholarships = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Scholarships & Grants</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage financial aid allocations and student waivers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Award size={18} /> New Grant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Merit Scholarship', type: 'Academic', coverage: '50% Tuition Waiver', students: 45, status: 'Active' },
          { name: 'Sports Quota Grant', type: 'Athletics', coverage: '$2,000 Flat', students: 12, status: 'Active' },
          { name: 'Need-based Aid 2024', type: 'Financial Aid', coverage: '100% Tuition Waiver', students: 8, status: 'Reviewing' },
        ].map((grant, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                grant.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' : 
                'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800'
              }`}>
                {grant.status}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{grant.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{grant.type}</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Coverage</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{grant.coverage}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Awarded Students</span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm">{grant.students}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'fees-structure': return renderStructure();
      case 'fees-collection': return renderCollection();
      case 'fees-pending': return renderPending();
      case 'fees-scholarships': return renderScholarships();
      default: return renderStructure();
    }
  };

  return (
    <>
      {renderActiveTab()}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Payment Record' : 'Record New Payment'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveFee} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                  <input type="text" required value={form.student} onChange={e => setForm({...form, student: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course / Program</label>
                    <input type="text" required value={form.course} onChange={e => setForm({...form, course: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Receipt/Invoice No.</label>
                    <input type="text" required value={form.invoiceNo} onChange={e => setForm({...form, invoiceNo: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                    <input type="text" required placeholder="$0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input type="text" required placeholder="e.g. Oct 15, 2024" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
