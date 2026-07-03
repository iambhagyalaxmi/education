import { TrendingUp, Users, UserPlus, IndianRupee, BookOpen, Building2, Calendar } from 'lucide-react';

export default function AdminAnalytics() {
  const enrollmentData = [65, 78, 90, 85, 110, 130];
  const feeData = [40, 50, 75, 60, 90, 110];
  const attendanceData = [85, 88, 92, 90, 94, 91];

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Analytics Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Comprehensive insights into institute performance.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm">
            <Calendar size={16} /> This Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Student Enrollment Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Student Enrollment</h3>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
              <TrendingUp size={14} /> +12%
            </span>
          </div>
          <div className="h-64 flex justify-between gap-4 mt-4">
            {enrollmentData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center flex-1 items-end">
                  <div className="w-full max-w-[3rem] bg-blue-50 dark:bg-blue-900/20 rounded-t-xl relative h-full">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t-xl transition-all duration-1000 group-hover:bg-blue-400"
                      style={{ height: `${(val / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Admission Trends */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <UserPlus size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Admission Trends</h3>
            </div>
          </div>
          <div className="h-64 flex flex-col justify-end relative">
            {/* SVG Line Chart Representation */}
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible preserve-3d">
              <path 
                d="M 0,40 Q 20,30 40,35 T 80,15 T 100,5" 
                fill="none" 
                stroke="currentColor" 
                className="text-purple-500" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M 0,50 L 0,40 Q 20,30 40,35 T 80,15 T 100,5 L 100,50 Z" 
                fill="currentColor" 
                className="text-purple-100 dark:text-purple-900/20" 
              />
              {[0, 40, 80, 100].map((cx, i) => (
                <circle key={i} cx={cx} cy={[40, 35, 15, 5][i]} r="2" fill="currentColor" className="text-purple-600 dark:text-purple-400" />
              ))}
            </svg>
            <div className="flex justify-between mt-2 px-1">
              {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <span key={q} className="text-xs font-semibold text-slate-500">{q}</span>)}
            </div>
          </div>
        </div>

        {/* Fee Collection */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <IndianRupee size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Fee Collection</h3>
            </div>
          </div>
          <div className="h-64 flex justify-between gap-2 mt-4">
            {feeData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center flex-1 items-end">
                  <div className="w-full max-w-[2.5rem] bg-emerald-50 dark:bg-emerald-900/20 rounded-t-lg relative h-full">
                    <div 
                      className="absolute bottom-0 w-full bg-emerald-500 dark:bg-emerald-600 rounded-t-lg transition-all duration-1000 group-hover:bg-emerald-400"
                      style={{ height: `${(val / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Attendance Statistics</h3>
            </div>
          </div>
          <div className="space-y-4">
            {attendanceData.map((val, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Department {['CS', 'IT', 'ME', 'CE', 'EE', 'BBA'][i]}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{val}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Popularity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                <BookOpen size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Course Popularity</h3>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
             {/* Simple CSS donut chart representation */}
             <div className="relative w-48 h-48 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#3b82f6 0% 35%, #8b5cf6 35% 60%, #10b981 60% 85%, #f43f5e 85% 100%)' }}>
               <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                 <div className="text-center">
                   <p className="text-3xl font-bold text-slate-800 dark:text-white">156</p>
                   <p className="text-xs text-slate-500 font-semibold">Total Courses</p>
                 </div>
               </div>
             </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
             <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> CS</div>
             <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> IT</div>
             <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> BBA</div>
             <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> Other</div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Building2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Department Performance</h3>
            </div>
          </div>
          <div className="h-64 flex justify-between gap-4 px-2 mt-4">
            {[88, 75, 92, 85, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex justify-center flex-1 items-end group">
                  <div className="w-full max-w-[2rem] bg-indigo-50 dark:bg-indigo-900/20 rounded-t flex items-end h-full">
                    <div 
                      className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t transition-all group-hover:bg-indigo-400"
                      style={{ height: `${val}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {['CS', 'ME', 'IT', 'CE', 'EE'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
