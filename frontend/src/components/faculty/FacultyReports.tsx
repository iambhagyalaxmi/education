import { 
  BarChart3, 
  Download,
  TrendingUp,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface FacultyReportsProps {
  activeTab: string;
}

export default function FacultyReports({ activeTab }: FacultyReportsProps) {

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderDashboardReport = (title: string, data: any) => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," 
              + "Metric,Value\n"
              + data.stats.map((stat: any) => `"${stat.label}","${stat.value}"`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${title.replace(/\s+/g, '_')}_Report.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
        >
          <Download size={18} /> Export Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        {data.stats.map((stat: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${stat.colorClass}`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{stat.value}</h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Average CGPA Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="cgpa" name="Average CGPA" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Rate (%)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="attendance" name="Attendance %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const performanceData = {
    stats: [
      { label: 'Avg CGPA', value: '8.2', icon: TrendingUp, colorClass: 'bg-emerald-100 text-emerald-600' },
      { label: 'Top Performers', value: '45', icon: Award, colorClass: 'bg-blue-100 text-blue-600' },
      { label: 'Needs Attention', value: '12', icon: Users, colorClass: 'bg-orange-100 text-orange-600' },
      { label: 'Pass Rate', value: '94%', icon: BookOpen, colorClass: 'bg-purple-100 text-purple-600' },
    ]
  };

  const chartData = [
    { name: 'Week 1', cgpa: 7.8, attendance: 95 },
    { name: 'Week 2', cgpa: 7.9, attendance: 92 },
    { name: 'Week 3', cgpa: 8.0, attendance: 96 },
    { name: 'Week 4', cgpa: 8.1, attendance: 94 },
    { name: 'Week 5', cgpa: 8.2, attendance: 97 },
    { name: 'Week 6', cgpa: 8.4, attendance: 95 },
    { name: 'Week 7', cgpa: 8.5, attendance: 98 },
  ];

  const attendanceData = {
    stats: [
      { label: 'Avg Attendance', value: '88%', icon: Users, colorClass: 'bg-emerald-100 text-emerald-600' },
      { label: 'Perfect Attendance', value: '25', icon: Award, colorClass: 'bg-blue-100 text-blue-600' },
      { label: 'Defaulters (<75%)', value: '8', icon: AlertTriangle, colorClass: 'bg-red-100 text-red-600' },
      { label: 'Classes Conducted', value: '142', icon: BookOpen, colorClass: 'bg-purple-100 text-purple-600' },
    ]
  };
  
  const marksData = {
    stats: [
      { label: 'Highest Score', value: '98', icon: Award, colorClass: 'bg-emerald-100 text-emerald-600' },
      { label: 'Lowest Score', value: '35', icon: TrendingUp, colorClass: 'bg-red-100 text-red-600' },
      { label: 'Avg Class Score', value: '76', icon: BarChart3, colorClass: 'bg-blue-100 text-blue-600' },
      { label: 'Distinctions', value: '18', icon: Users, colorClass: 'bg-purple-100 text-purple-600' },
    ]
  };

  const completionData = {
    stats: [
      { label: 'Syllabus Covered', value: '85%', icon: BookOpen, colorClass: 'bg-emerald-100 text-emerald-600' },
      { label: 'Modules Left', value: '2', icon: BarChart3, colorClass: 'bg-orange-100 text-orange-600' },
      { label: 'Classes Left', value: '12', icon: Users, colorClass: 'bg-blue-100 text-blue-600' },
      { label: 'On Track', value: 'Yes', icon: CheckCircle, colorClass: 'bg-purple-100 text-purple-600' },
    ]
  };
  
  // Dummy icon components for missing lucide imports used in objects
  function CheckCircle(props: Record<string, unknown>) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>; }
  function AlertTriangle(props: Record<string, unknown>) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>; }


  const renderPlaceholder = (title: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="text-slate-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">
          The {title.toLowerCase()} module is ready for integration. Connect your database to generate analytics.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'reports-performance':
      return renderDashboardReport('Student Performance Report', performanceData);
    case 'reports-attendance':
      return renderDashboardReport('Attendance Analytics', attendanceData);
    case 'reports-marks':
      return renderDashboardReport('Marks Distribution Report', marksData);
    case 'reports-completion':
      return renderDashboardReport('Course Completion Status', completionData);
    default:
      return renderPlaceholder('Reports & Analytics', BarChart3);
  }
}
