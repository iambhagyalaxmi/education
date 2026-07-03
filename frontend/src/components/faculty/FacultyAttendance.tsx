import { 
  CheckSquare, 
  Search, 
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface FacultyAttendanceProps {
  activeTab: string;
}

export default function FacultyAttendance({ activeTab }: FacultyAttendanceProps) {

  const renderTakeAttendance = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Take Attendance</h2>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2">
            <Calendar size={18} /> Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            Submit Attendance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>CS401: Data Structures - Batch A</option>
            <option>CS402: Operating Systems - Batch B</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Time Slot</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>09:00 AM - 10:00 AM</option>
            <option>10:00 AM - 11:00 AM</option>
          </select>
        </div>
        <button className="w-full md:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
          Load Students
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative max-w-sm w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search student..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <button className="px-3 py-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">Mark All Present</button>
            <button className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Mark All Absent</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Overall %</th>
                <th className="px-6 py-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { roll: 'CS24-001', name: 'Alice Smith', percent: 92, status: 'present' },
                { roll: 'CS24-002', name: 'Bob Johnson', percent: 85, status: 'present' },
                { roll: 'CS24-003', name: 'Charlie Davis', percent: 65, status: 'absent' },
                { roll: 'CS24-004', name: 'Diana Prince', percent: 98, status: 'present' },
                { roll: 'CS24-005', name: 'Evan Wright', percent: 45, status: 'late' },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{student.roll}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${student.percent > 75 ? 'text-emerald-600' : student.percent > 60 ? 'text-orange-600' : 'text-red-600'}`}>
                      {student.percent}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all
                        ${student.status === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}
                      `}>
                        <CheckCircle2 size={16} className={student.status === 'present' ? 'text-emerald-500' : ''} /> Present
                      </button>
                      <button className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all
                        ${student.status === 'absent' ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}
                      `}>
                        <XCircle size={16} className={student.status === 'absent' ? 'text-red-500' : ''} /> Absent
                      </button>
                      <button className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all
                        ${student.status === 'late' ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}
                      `}>
                        <AlertCircle size={16} className={student.status === 'late' ? 'text-orange-500' : ''} /> Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAttendanceReports = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Attendance Reports</h2>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckSquare size={32} />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">84%</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Attendance</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">12</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Students &lt; 75%</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Calendar size={32} />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">24</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Classes Conducted</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Defaulters List (Below 75%)</h3>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</button>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Attendance %</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { roll: 'CS24-003', name: 'Charlie Davis', course: 'Data Structures', percent: 65 },
                { roll: 'CS24-005', name: 'Evan Wright', course: 'Data Structures', percent: 45 },
                { roll: 'CS24-012', name: 'Fiona Gallagher', course: 'Operating Systems', percent: 72 },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{student.roll}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 text-slate-600">{student.course}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${student.percent < 60 ? 'text-red-600' : 'text-orange-600'}`}>
                      {student.percent}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50">
                      Send Warning
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

  const renderPlaceholder = (title: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="text-slate-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage attendance records.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'attendance-take':
      return renderTakeAttendance();
    case 'attendance-edit':
      return renderPlaceholder('Edit Attendance', CheckSquare);
    case 'attendance-reports':
      return renderAttendanceReports();
    default:
      return renderPlaceholder('Attendance Management', CheckSquare);
  }
}
