import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlaneTakeoff, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FacultyLeaveProps {
  activeTab: string;
}

export default function FacultyLeave({ activeTab }: FacultyLeaveProps) {
  const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
  const [leaveDays, setLeaveDays] = useState('1');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaveHistory = async () => {
    try {
      const response = await axios.get('/api/leave');
      setLeaveHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch leave history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const renderApplyLeave = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Apply for Leave</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Leave Type</label>
              <select 
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Casual Leave (CL)</option>
                <option>Sick Leave (SL)</option>
                <option>Earned Leave (EL)</option>
                <option>On Duty (OD)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Days</label>
              <input 
                type="number" 
                min="1" 
                value={leaveDays}
                onChange={(e) => setLeaveDays(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">From Date</label>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">To Date</label>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700" 
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for Leave</label>
            <textarea 
              rows={4} 
              placeholder="Please provide a brief reason..." 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              disabled={isSubmitting}
              onClick={async () => {
                if (fromDate && toDate && reason) {
                  setIsSubmitting(true);
                  try {
                    await axios.post('/api/leave', {
                      type: leaveType,
                      duration: `${fromDate} to ${toDate}`,
                      fromDate,
                      toDate,
                      reason
                    });
                    
                    alert('Leave Application Submitted Successfully!');
                    
                    // Reset form
                    setLeaveType('Casual Leave (CL)');
                    setLeaveDays('1');
                    setFromDate('');
                    setToDate('');
                    setReason('');
                    
                    // Refresh history
                    fetchLeaveHistory();
                  } catch (error) {
                    console.error('Error submitting leave:', error);
                    alert('Failed to submit leave application.');
                  } finally {
                    setIsSubmitting(false);
                  }
                } else {
                  alert('Please fill out all fields before submitting.');
                }
              }}
              className={`px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-emerald-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Leave Application'}
            </button>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18}/> Leave Balances</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-600">Casual Leave (CL)</span>
                  <span className="text-emerald-600 font-bold">8 / 12</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-600">Sick Leave (SL)</span>
                  <span className="text-blue-600 font-bold">10 / 10</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-600">Earned Leave (EL)</span>
                  <span className="text-orange-600 font-bold">3 / 15</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>Leaves longer than 3 days require HOD approval. Please ensure your classes are substituted before applying.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaveHistory = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Leave History</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Days</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <span className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                  </td>
                </tr>
              ) : leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No leave history found.
                  </td>
                </tr>
              ) : (
                leaveHistory.map((leave, i) => {
                  let color = 'slate';
                  if (leave.status === 'Approved') color = 'emerald';
                  else if (leave.status === 'Pending') color = 'orange';
                  else if (leave.status === 'Rejected') color = 'rose';

                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{leave.type}</td>
                      <td className="px-6 py-4 flex items-center gap-2"><Calendar size={14} className="text-slate-400"/> {leave.duration}</td>
                      <td className="px-6 py-4 font-medium">
                        {leave.days || (
                          leave.duration.includes('to') ? 
                          Math.max(1, Math.ceil((new Date(leave.duration.split(' to ')[1]).getTime() - new Date(leave.duration.split(' to ')[0]).getTime()) / (1000 * 3600 * 24)) + 1)
                          : 1
                        )} Day(s)
                      </td>
                      <td className="px-6 py-4 truncate max-w-[200px]" title={leave.reason}>{leave.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-${color}-50 text-${color}-700`}>
                          {leave.status === 'Approved' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLeaveStatus = () => {
    const pendingLeave = leaveHistory.find(l => l.status === 'Pending');

    if (!pendingLeave) {
      return (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Leave Status Tracking</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center max-w-3xl mx-auto mt-8">
             <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-700">No Pending Applications</h3>
             <p className="text-slate-500 mt-2">You don't have any leave applications currently under review.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Leave Status Tracking</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl mx-auto mt-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{pendingLeave.type}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                <Calendar size={14} /> {pendingLeave.duration}
              </p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">Pending</span>
            </div>
          </div>

          <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-[15px] before:w-0.5 before:bg-slate-200">
            
            <div className="relative">
              <div className="absolute left-[-32px] top-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_0_4px_white]">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="font-bold text-slate-800">Application Submitted</h4>
              <p className="text-sm text-slate-500 mt-1">Submitted on {new Date(pendingLeave.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>

            <div className="relative">
              <div className="absolute left-[-32px] top-1 w-8 h-8 rounded-full bg-white border-2 border-orange-500 text-orange-500 flex items-center justify-center shadow-[0_0_0_4px_white]">
                <Clock size={16} />
              </div>
              <h4 className="font-bold text-orange-600">HOD Approval Pending</h4>
              <p className="text-sm text-slate-500 mt-1">Awaiting final approval from Head of Department</p>
            </div>

            <div className="relative opacity-50">
              <div className="absolute left-[-32px] top-1 w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center shadow-[0_0_0_4px_white]">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              </div>
              <h4 className="font-bold text-slate-500">Leave Granted</h4>
              <p className="text-sm text-slate-400 mt-1">Final confirmation will appear here</p>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button 
              disabled={isSubmitting}
              onClick={async () => {
                if (confirm('Are you sure you want to withdraw this application?')) {
                  setIsSubmitting(true);
                  try {
                    await axios.delete(`/api/leave?id=${pendingLeave.id}`);
                    fetchLeaveHistory();
                  } catch (error) {
                    console.error(error);
                    alert('Failed to withdraw application');
                  } finally {
                    setIsSubmitting(false);
                  }
                }
              }}
              className={`px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors ${isSubmitting ? 'opacity-50 cursor-wait' : 'hover:bg-slate-50'}`}
            >
              {isSubmitting ? 'Withdrawing...' : 'Withdraw Application'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholder = (title: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="text-slate-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage leave workflows.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'leave-apply':
      return renderApplyLeave();
    case 'leave-history':
      return renderLeaveHistory();
    case 'leave-status':
      return renderLeaveStatus();
    default:
      return renderPlaceholder('Leave Management', PlaneTakeoff);
  }
}
