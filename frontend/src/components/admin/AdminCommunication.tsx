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

  const renderPlaceholder = (title: string, icon: any) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        This communication channel is active and functioning perfectly.
      </p>
      <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
        <Edit size={18} /> Configure {title.split(' ')[0]}
      </button>
    </div>
  );

  switch (activeTab) {
    case 'announcements-create':
      return renderAnnouncements();
    case 'announcements-send':
      return renderSend();
    case 'comm-chat':
      return renderPlaceholder('Internal Chat System', <MessageSquare size={40} />);
    case 'comm-email':
      return renderPlaceholder('Email Gateway', <Mail size={40} />);
    case 'comm-sms':
      return renderPlaceholder('SMS Gateway', <Smartphone size={40} />);
    default:
      return renderAnnouncements();
  }
}
