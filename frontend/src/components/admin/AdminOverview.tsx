import { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  UserPlus, 
  IndianRupee, 
  CalendarDays, 
  Megaphone,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Bell,
  ChevronRight
} from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
}

interface AdminStats {
  totalStudents: number;
  totalFaculty: number;
  totalStaff: number;
  totalCourses: number;
  pendingAdmissions: number;
  activeAnnouncements: number;
  todaysClasses: number;
  pendingFees: number;
  pendingLeaveRequests: number;
  recentAuditLogs: any[];
}

export default function AdminOverview({ setActiveTab }: Props) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) { console.error(e); }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  const quickActions = [
    { label: 'Add Student', icon: UserPlus, color: 'text-blue-600 bg-blue-100', tab: 'students-register' },
    { label: 'Add Faculty', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-100', tab: 'faculty-list' },
    { label: 'Create Course', icon: BookOpen, color: 'text-purple-600 bg-purple-100', tab: 'courses-list' },
    { label: 'Publish Announcement', icon: Megaphone, color: 'text-rose-600 bg-rose-100', tab: 'comm-announcements' },
    { label: 'Collect Fees', icon: IndianRupee, color: 'text-orange-600 bg-orange-100', tab: 'fees-collection' },
    { label: 'Generate Report', icon: FileText, color: 'text-indigo-600 bg-indigo-100', tab: 'reports' },
    { label: 'Manage Users', icon: Users, color: 'text-slate-600 bg-slate-100', tab: 'staff-list' }
  ];

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), trend: 'Live', up: true, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Faculty', value: stats.totalFaculty.toLocaleString(), trend: 'Live', up: true, icon: GraduationCap, color: 'bg-emerald-500' },
    { label: 'Total Staff', value: stats.totalStaff.toLocaleString(), trend: 'Live', up: true, icon: Briefcase, color: 'bg-slate-500' },
    { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), trend: 'Live', up: true, icon: BookOpen, color: 'bg-purple-500' },
    { label: 'Pending Admissions', value: stats.pendingAdmissions.toLocaleString(), trend: 'Live', up: stats.pendingAdmissions === 0, icon: UserPlus, color: 'bg-indigo-500' },
    { label: 'Pending Fees', value: stats.pendingFees.toLocaleString(), trend: 'Live', up: stats.pendingFees === 0, icon: IndianRupee, color: 'bg-orange-500' },
    { label: 'Timetable Entries', value: stats.todaysClasses.toLocaleString(), trend: 'Live', up: true, icon: CalendarDays, color: 'bg-teal-500' },
    { label: 'Active Announce.', value: stats.activeAnnouncements.toLocaleString(), trend: 'Live', up: true, icon: Megaphone, color: 'bg-rose-500' }
  ] : [];

  const notificationCards = stats ? [
    { title: 'Pending Admissions', count: stats.pendingAdmissions, priority: 'high', tab: 'admissions-new' },
    { title: 'Pending Fee Payments', count: stats.pendingFees, priority: 'medium', tab: 'fees-pending' },
    { title: 'Leave Requests', count: stats.pendingLeaveRequests, priority: 'medium', tab: 'hr-leave' },
    { title: 'Active Announcements', count: stats.activeAnnouncements, priority: 'low', tab: 'comm-announcements' },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Live data from NeonDB. Here's what's happening right now.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(action.tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${action.color}`}
            >
              <action.icon size={16} />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity from Audit Logs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
            <button onClick={() => setActiveTab('audit-logs')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-9 h-9 bg-slate-200 rounded-xl shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stats?.recentAuditLogs && stats.recentAuditLogs.length > 0 ? (
            <div className="space-y-4">
              {stats.recentAuditLogs.map((log: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${log.actionType === 'INSERT' ? 'bg-emerald-100 text-emerald-600' : log.actionType === 'DELETE' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {log.actionType === 'INSERT' ? <UserPlus size={16} /> : log.actionType === 'DELETE' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{log.actionType} on {log.tableName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{log.user?.email || 'System'}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Clock size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No recent activity in audit logs.</p>
            </div>
          )}
        </div>

        {/* Live Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Bell size={18} className="text-slate-500" /> Action Required
            </h3>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {notificationCards.map((n, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(n.tab)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-sm
                    ${n.priority === 'high' && n.count > 0 ? 'bg-rose-50 border-rose-200 text-rose-800' :
                      n.priority === 'medium' && n.count > 0 ? 'bg-amber-50 border-amber-200 text-amber-800' :
                      'bg-slate-50 border-slate-200 text-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{n.count}</span>
                    <span className="font-semibold text-sm">{n.title}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-60" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
