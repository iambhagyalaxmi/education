import { useState } from 'react';
import { Search, Filter, Download, FileText, TrendingUp, PieChart, BarChart2 } from 'lucide-react';

export default function AdminReports({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderReportCard = (title: string, desc: string, icon: any, type: string) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{desc}</p>
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Format: {type}</span>
        <button onClick={() => alert(`Report "${title}" generated successfully!`)} className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-sm font-bold flex items-center gap-1">
          Generate <Download size={14} />
        </button>
      </div>
    </div>
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderReports = (title: string, reports: any[]) => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate, view, and export detailed analytical reports.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-6">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Filter size={16} /> Filter by Date Range
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((r, i) => (
          <div key={i}>
            {renderReportCard(r.title, r.desc, r.icon, r.type)}
          </div>
        ))}
      </div>
    </div>
  );

  const getReports = () => {
    switch (activeTab) {
      case 'reports-student':
        return [
          { title: 'Student Demographics', desc: 'Breakdown of students by age, gender, and location.', icon: <PieChart size={24}/>, type: 'PDF / Excel' },
          { title: 'Enrollment Trends', desc: 'Year-over-year enrollment statistics across programs.', icon: <TrendingUp size={24}/>, type: 'Excel' },
          { title: 'Dropout Analysis', desc: 'Detailed report on student attrition rates.', icon: <BarChart2 size={24}/>, type: 'PDF' },
        ];
      case 'reports-faculty':
        return [
          { title: 'Faculty Workload', desc: 'Distribution of teaching hours across all departments.', icon: <BarChart2 size={24}/>, type: 'PDF / Excel' },
          { title: 'Performance Metrics', desc: 'Faculty evaluations and feedback summaries.', icon: <TrendingUp size={24}/>, type: 'PDF' },
        ];
      case 'reports-financial':
        return [
          { title: 'Revenue Collection', desc: 'Monthly fee collection and outstanding dues summary.', icon: <BarChart2 size={24}/>, type: 'Excel' },
          { title: 'Expense Report', desc: 'Detailed breakdown of institutional expenses.', icon: <PieChart size={24}/>, type: 'Excel' },
          { title: 'Payroll Summary', desc: 'Monthly salary payouts and tax deductions.', icon: <FileText size={24}/>, type: 'PDF / Excel' },
        ];
      case 'reports-attendance':
        return [
          { title: 'Daily Attendance Log', desc: 'Master list of student attendance for all classes.', icon: <FileText size={24}/>, type: 'Excel' },
          { title: 'Low Attendance Alert', desc: 'List of students falling below the 75% threshold.', icon: <TrendingUp size={24}/>, type: 'PDF' },
        ];
      case 'reports-academic':
        return [
          { title: 'Result Analysis', desc: 'Program-wise pass percentage and grade distribution.', icon: <BarChart2 size={24}/>, type: 'PDF / Excel' },
          { title: 'Toppers List', desc: 'Highest achieving students across all programs.', icon: <FileText size={24}/>, type: 'PDF' },
        ];
      default:
        return [];
    }
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titles: any = {
    'reports-student': 'Student Reports',
    'reports-faculty': 'Faculty Reports',
    'reports-financial': 'Financial Reports',
    'reports-attendance': 'Attendance Reports',
    'reports-academic': 'Academic Reports',
  };

  return renderReports(titles[activeTab] || 'Reports', getReports());
}
