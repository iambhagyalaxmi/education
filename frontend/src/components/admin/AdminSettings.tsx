import { useState, useEffect } from 'react';
import { Shield, Settings, Database, Key, Server, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  actionType: string;
  tableName: string;
  recordId: string;
  createdAt: string;
  user?: { name: string; email: string };
}

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

  const AuditLogsView = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page] = useState(1);

    const fetchAuditLogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/audit?page=${page}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          // API returns { logs, total, page, totalPages } or array
          const logs = Array.isArray(data) ? data : (data.logs || []);
          setAuditLogs(logs);
        }
      } catch (e) { console.error(e); }
      setIsLoading(false);
    };

    useEffect(() => { fetchAuditLogs(); }, [page]);

    return (
      <div className="space-y-6 animate-fade-in-up pb-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Logs</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track system activity and user actions — live from NeonDB.</p>
          </div>
          <button
            onClick={fetchAuditLogs}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> Refresh
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
                  <th className="p-4">Table</th>
                  <th className="p-4">Record ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4 pl-6"><div className="h-4 bg-slate-200 rounded w-40"></div></td>
                      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                    </tr>
                  ))
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                      No audit logs found in the database.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors font-mono text-sm">
                      <td className="p-4 pl-6 text-slate-500 dark:text-slate-400">
                        {new Date(log.createdAt).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                        {log.user?.email || log.user?.name || 'System'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold
                          ${log.actionType === 'INSERT' ? 'bg-emerald-100 text-emerald-700' :
                            log.actionType === 'DELETE' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'}`}>
                          {log.actionType}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{log.tableName}</td>
                      <td className="p-4 text-slate-400 text-xs">{log.recordId?.slice(0, 8)}...</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  switch (activeTab) {
    case 'settings':
      return renderSettings();
    case 'audit-logs':
      return <AuditLogsView />;
    default:
      return renderSettings();
  }
}
