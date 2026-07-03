import { useState } from 'react';
import { Search, Plus, Send, MessageSquare, Mail, Bell, Smartphone, Edit } from 'lucide-react';

export default function AdminCommunication({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderAnnouncements = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Announcements</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and broadcast institutional notices.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search announcements..." 
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
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Audience</th>
                <th className="p-4">Date Posted</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { title: 'Diwali Holidays Declaration', aud: 'All Students & Staff', date: 'Oct 20, 2024', status: 'Published' },
                { title: 'Mid-Term Exam Schedule Revised', aud: 'B.Tech CS Students', date: 'Oct 22, 2024', status: 'Draft' },
              ].map((ann, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Bell size={20} />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{ann.title}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{ann.aud}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{ann.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      ann.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {ann.status}
                    </span>
                  </td>
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

  const renderSend = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Send Message</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Compose and send emails, SMS, or app notifications.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message Type</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option>Email</option>
                <option>SMS</option>
                <option>Push Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Audience</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option>All Students</option>
                <option>All Faculty</option>
                <option>Specific Department</option>
                <option>Parents</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject (for Email/App)</label>
              <input type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Enter subject..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message Body</label>
              <textarea rows={6} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Type your message here..."></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm">
              <Send size={18} /> Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Internal Chat System</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor and manage internal messaging.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <MessageSquare size={18} /> New Group Chat
        </button>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center justify-center h-64">
        <MessageSquare size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Chat Module Active</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-md">The real-time internal communication server is running. No active administrative alerts at this time.</p>
      </div>
    </div>
  );

  const renderEmail = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Email Gateway Logs</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track automated and bulk email communications.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Mail size={18} /> SMTP Settings
        </button>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6">Campaign / Subject</th>
              <th className="p-4">Recipients</th>
              <th className="p-4">Sent Date</th>
              <th className="p-4">Delivery Rate</th>
              <th className="p-4 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { subject: 'Semester Registration Open', rec: '2,450 Students', date: 'Oct 21, 2024', rate: '99.8%', status: 'Completed' },
              { subject: 'Fee Payment Reminder', rec: '450 Defaulters', date: 'Oct 22, 2024', rate: '98.5%', status: 'Completed' },
              { subject: 'Faculty Meeting Agenda', rec: '120 Staff', date: 'Oct 23, 2024', rate: '100%', status: 'Scheduled' },
            ].map((log, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">{log.subject}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{log.rec}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{log.date}</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{log.rate}</td>
                <td className="p-4 pr-6 text-right">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSMS = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">SMS Notifications</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View SMS delivery logs and credit balances.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Smartphone size={18} /> Buy Credits
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Available Credits</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">14,250</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Sent This Month</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">5,420</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Delivery Success</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">97.4%</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6">Message Preview</th>
              <th className="p-4">Recipients</th>
              <th className="p-4">Date</th>
              <th className="p-4 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { msg: 'Important: Tomorrow is a declared holiday...', rec: '3,500', date: 'Oct 20, 2024', status: 'Delivered' },
              { msg: 'Library book overdue alert: Introduction...', rec: '45', date: 'Oct 22, 2024', status: 'Delivered' },
            ].map((log, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{log.msg}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{log.rec}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{log.date}</td>
                <td className="p-4 pr-6 text-right">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'announcements-create':
      return renderAnnouncements();
    case 'announcements-send':
      return renderSend();
    case 'comm-chat':
      return renderChat();
    case 'comm-email':
      return renderEmail();
    case 'comm-sms':
      return renderSMS();
    default:
      return renderAnnouncements();
  }
}
