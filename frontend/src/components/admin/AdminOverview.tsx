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
  AlertCircle
} from 'lucide-react';

export default function AdminOverview() {
  const stats = [
    { label: 'Total Students', value: '12,450', trend: '+5.2%', icon: Users, color: 'bg-blue-500' },
    { label: 'Total Faculty', value: '842', trend: '+1.4%', icon: GraduationCap, color: 'bg-emerald-500' },
    { label: 'Total Staff', value: '420', trend: '0%', icon: Briefcase, color: 'bg-slate-500' },
    { label: 'Total Courses', value: '156', trend: '+12%', icon: BookOpen, color: 'bg-purple-500' },
    { label: 'New Admissions', value: '1,240', trend: '+18.5%', icon: UserPlus, color: 'bg-indigo-500' },
    { label: "Today's Fee Coll.", value: '₹4.2M', trend: '-2.4%', icon: IndianRupee, color: 'bg-orange-500' },
    { label: "Today's Classes", value: '342', trend: '0%', icon: CalendarDays, color: 'bg-teal-500' },
    { label: 'Active Announce.', value: '12', trend: '+4', icon: Megaphone, color: 'bg-rose-500' }
  ];

  const quickActions = [
    { label: 'Add Student', icon: UserPlus, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Add Faculty', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Create Course', icon: BookOpen, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Publish Announcement', icon: Megaphone, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400' },
    { label: 'Collect Fees', icon: IndianRupee, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Generate Report', icon: FileText, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { label: 'Manage Users', icon: Users, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400' }
  ];

  const recentActivities = [
    { title: 'New Student Registered', desc: 'Rahul Sharma enrolled in B.Tech CS', time: '10 mins ago', type: 'success' },
    { title: 'Faculty Added', desc: 'Dr. Anita Desai joined Physics Dept', time: '1 hour ago', type: 'info' },
    { title: 'Fees Collected', desc: '₹2,50,000 collected via Online Portal', time: '2 hours ago', type: 'success' },
    { title: 'Announcement Published', desc: 'Holiday declared for Diwali', time: '4 hours ago', type: 'warning' },
    { title: 'System Alert', desc: 'Database backup completed successfully', time: '5 hours ago', type: 'info' },
  ];

  const notifications = [
    { title: 'Pending Admissions', count: 45, priority: 'high' },
    { title: 'Pending Fee Payments', count: 128, priority: 'medium' },
    { title: 'Faculty Leave Requests', count: 12, priority: 'medium' },
    { title: 'Student Complaints', count: 3, priority: 'high' },
    { title: 'Upcoming Examinations', count: 5, priority: 'low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back, Super Admin. Here is what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Academic Year:</span>
          <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>2023 - 2024</option>
            <option>2022 - 2023</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith('+');
          const isNeutral = stat.trend === '0%';
          return (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  isNeutral ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 
                  isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                  {isPositive ? <ArrowUpRight size={14} /> : isNeutral ? null : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.label}</h3>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button key={index} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 px-4 py-2.5 rounded-xl transition-all hover:shadow-sm group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Chart Placeholder (CSS based) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Admission Trends</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 100].map((height, i) => (
              <div key={i} className="w-1/6 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex justify-center h-full items-end">
                  <div 
                    className="w-full max-w-[3rem] bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg relative"
                    style={{ height: '100%' }}
                  >
                    <div 
                      className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-1000 group-hover:bg-indigo-400"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Month {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Action Required</h3>
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">5</span>
          </div>
          <div className="space-y-4">
            {notifications.map((notif, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    notif.priority === 'high' ? 'bg-rose-500' : 
                    notif.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{notif.title}</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                  {notif.count}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
            View All Notifications
          </button>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activities</h3>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">View Log</button>
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
