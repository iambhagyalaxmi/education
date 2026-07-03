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

export default function AdminOverview({ setActiveTab }: Props) {
  const stats = [
    { label: 'Total Students', value: '12,450', trend: '+5.2%', up: true, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Faculty', value: '842', trend: '+1.4%', up: true, icon: GraduationCap, color: 'bg-emerald-500' },
    { label: 'Total Staff', value: '420', trend: '0%', up: true, icon: Briefcase, color: 'bg-slate-500' },
    { label: 'Total Courses', value: '156', trend: '+12%', up: true, icon: BookOpen, color: 'bg-purple-500' },
    { label: 'New Admissions', value: '1,240', trend: '+18.5%', up: true, icon: UserPlus, color: 'bg-indigo-500' },
    { label: "Today's Fee Coll.", value: '₹4.2M', trend: '-2.4%', up: false, icon: IndianRupee, color: 'bg-orange-500' },
    { label: "Today's Classes", value: '342', trend: '0%', up: true, icon: CalendarDays, color: 'bg-teal-500' },
    { label: 'Active Announce.', value: '12', trend: '+4', up: true, icon: Megaphone, color: 'bg-rose-500' }
  ];

  const quickActions = [
    { label: 'Add Student', icon: UserPlus, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', tab: 'students-register' },
    { label: 'Add Faculty', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400', tab: 'faculty-list' },
    { label: 'Create Course', icon: BookOpen, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', tab: 'courses-list' },
    { label: 'Publish Announcement', icon: Megaphone, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400', tab: 'comm-announcements' },
    { label: 'Collect Fees', icon: IndianRupee, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400', tab: 'fees-collection' },
    { label: 'Generate Report', icon: FileText, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400', tab: 'reports' },
    { label: 'Manage Users', icon: Users, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400', tab: 'staff-list' }
  ];

  const recentActivities = [
    { title: 'New Student Registered', desc: 'Rahul Sharma enrolled in B.Tech CS', time: '10 mins ago', type: 'success' },
    { title: 'Faculty Added', desc: 'Dr. Anita Desai joined Physics Dept', time: '1 hour ago', type: 'info' },
    { title: 'Fees Collected', desc: '₹2,50,000 collected via Online Portal', time: '2 hours ago', type: 'success' },
    { title: 'Announcement Published', desc: 'Holiday declared for Diwali', time: '4 hours ago', type: 'warning' },
    { title: 'System Alert', desc: 'Database backup completed successfully', time: '5 hours ago', type: 'info' },
  ];

  const notifications = [
    { title: 'Pending Admissions', count: 45, priority: 'high', tab: 'admissions-new' },
    { title: 'Pending Fee Payments', count: 128, priority: 'medium', tab: 'fees-pending' },
    { title: 'Faculty Leave Requests', count: 12, priority: 'medium', tab: 'hr-leave' },
    { title: 'Student Complaints', count: 3, priority: 'high', tab: 'comm-announcements' },
    { title: 'Upcoming Examinations', count: 5, priority: 'low', tab: 'exams-schedule' },
  ];

  const barHeights = [40, 65, 55, 80, 60, 90, 70, 85, 75, 95, 65, 100];

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(action.tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${action.color}`}
            >
              <action.icon size={16} />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Monthly Bar Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Enrollment Trend</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly student enrollment data</p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              Full Analytics <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex items-end gap-2 h-40">
            {barHeights.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md relative overflow-hidden" style={{ height: '140px' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 dark:bg-indigo-400 rounded-t-md transition-all duration-700"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Action Required</h3>
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 flex items-center justify-center text-xs font-bold">
              {notifications.length}
            </span>
          </div>
          <div className="space-y-2">
            {notifications.map((notif, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(notif.tab)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    notif.priority === 'high' ? 'bg-rose-500' : 
                    notif.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{notif.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                    {notif.count}
                  </span>
                  <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('admissions-new')}
            className="w-full mt-4 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <Bell size={15} /> View All Notifications
          </button>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activities</h3>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              View Full Log <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className={`mt-0.5 shrink-0 ${
                  activity.type === 'success' ? 'text-emerald-500' :
                  activity.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
                }`}>
                  {activity.type === 'success' ? <CheckCircle2 size={20} /> :
                   activity.type === 'warning' ? <AlertCircle size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{activity.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.desc}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
