import { useState } from 'react';
import { Search, Plus, FileText, CheckCircle, Edit, Calendar } from 'lucide-react';

export default function AdminExaminations({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderSchedule = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Examination Schedule</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage exam timetables across all departments.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Calendar size={18} /> Schedule Exam
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by exam name or course..." 
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
                <th className="p-4 pl-6">Exam Name</th>
                <th className="p-4">Course / Program</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Mid-Term Exam', course: 'B.Tech CS - Sem 3', date: 'Oct 15, 2024 • 10:00 AM', duration: '2 Hours', status: 'Upcoming' },
                { name: 'Final Semester Exam', course: 'BBA - Sem 1', date: 'Dec 10, 2024 • 09:00 AM', duration: '3 Hours', status: 'Scheduled' },
                { name: 'Practical Assessment', course: 'B.Tech IT - Sem 5', date: 'Nov 05, 2024 • 01:00 PM', duration: '4 Hours', status: 'Upcoming' },
              ].map((exam, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FileText size={20} />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{exam.name}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{exam.course}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{exam.date}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{exam.duration}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {exam.status}
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

  const renderResults = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Exam Results Publication</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review and publish finalized student results.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <CheckCircle size={18} /> Publish Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { exam: 'Spring 2024 Finals', program: 'B.Tech CS', total: 120, passed: 115, status: 'Draft' },
          { exam: 'Mid-Term 2024', program: 'BBA', total: 60, passed: 58, status: 'Published' },
          { exam: 'Practical Boards', program: 'B.Tech IT', total: 85, passed: 85, status: 'Published' },
        ].map((res, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                res.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' : 
                'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800'
              }`}>
                {res.status}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{res.exam}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{res.program}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pass Rate</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{Math.round((res.passed/res.total)*100)}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Appeared</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{res.total}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrading = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Grade Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure grading scales and GPA calculations.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Grade Rule
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Grade</th>
                <th className="p-4">Marks Range</th>
                <th className="p-4">Grade Points</th>
                <th className="p-4">Description</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { grade: 'O', range: '90 - 100', points: '10.0', desc: 'Outstanding' },
                { grade: 'A+', range: '80 - 89', points: '9.0', desc: 'Excellent' },
                { grade: 'A', range: '70 - 79', points: '8.0', desc: 'Very Good' },
                { grade: 'B+', range: '60 - 69', points: '7.0', desc: 'Good' },
                { grade: 'B', range: '50 - 59', points: '6.0', desc: 'Above Average' },
                { grade: 'F', range: '0 - 49', points: '0.0', desc: 'Fail' },
              ].map((rule, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-bold text-indigo-600 dark:text-indigo-400">{rule.grade}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{rule.range}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{rule.points}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{rule.desc}</td>
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

  switch (activeTab) {
    case 'exams-schedule':
      return renderSchedule();
    case 'exams-results':
      return renderResults();
    case 'exams-grading':
      return renderGrading();
    default:
      return renderSchedule();
  }
}
