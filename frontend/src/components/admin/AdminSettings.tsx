import { Shield, Settings, Database, Key, Server, RefreshCw } from 'lucide-react';

export default function AdminSettings({ activeTab }: { activeTab: string }) {

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure global application preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'General Preferences', icon: <Settings size={24}/>, desc: 'Manage institute name, logo, and academic year.' },
          { title: 'Security & Roles', icon: <Shield size={24}/>, desc: 'Configure role-based access control and policies.' },
          { title: 'Database Backup', icon: <Database size={24}/>, desc: 'Schedule and manage database backups.' },
          { title: 'API Keys & Integrations', icon: <Key size={24}/>, desc: 'Manage third-party integrations (Payment, SMS).' },
          { title: 'Server Status', icon: <Server size={24}/>, desc: 'Monitor system health and server logs.' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-4">
              {s.icon}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Logs</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track system activity and user actions.</p>
        </div>
        <button onClick={() => alert('Audit logs refreshed!')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { time: '2024-10-22 14:30:05', user: 'admin@institute.edu', action: 'Updated Fee Structure', ip: '192.168.1.45' },
                { time: '2024-10-22 12:15:22', user: 'hr@institute.edu', action: 'Processed September Payroll', ip: '192.168.1.112' },
                { time: '2024-10-22 09:05:10', user: 'admin@institute.edu', action: 'System Login', ip: '192.168.1.45' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors font-mono text-sm">
                  <td className="p-4 pl-6 text-slate-500 dark:text-slate-400">{log.time}</td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{log.user}</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400">{log.action}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'settings':
      return renderSettings();
    case 'audit-logs':
      return renderAuditLogs();
    default:
      return renderSettings();
  }
}
