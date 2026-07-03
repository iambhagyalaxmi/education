import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Mail, 
  Eye,
  TrendingUp,
  Award
} from 'lucide-react';

interface FacultyStudentsProps {
  activeTab: string;
}

export default function FacultyStudents({ activeTab }: FacultyStudentsProps) {

  const renderStudentList = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Student List</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center">
            <Download size={18} /> Export
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex-1 sm:flex-none justify-center">
            + Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name, roll no, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 sm:flex-none">
              <option>All Courses</option>
              <option>CS401: Data Structures</option>
              <option>CS402: Operating Systems</option>
            </select>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Course Batch</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { name: 'Alice Smith', email: 'alice.smith@student.edu', roll: 'CS24-001', batch: 'Sem 4 - B1', attendance: 92, status: 'Active' },
                { name: 'Bob Johnson', email: 'bob.j@student.edu', roll: 'CS24-002', batch: 'Sem 4 - B1', attendance: 85, status: 'Active' },
                { name: 'Charlie Davis', email: 'charlie.d@student.edu', roll: 'CS24-003', batch: 'Sem 4 - B2', attendance: 65, status: 'Warning' },
                { name: 'Diana Prince', email: 'diana.p@student.edu', roll: 'CS24-004', batch: 'Sem 6 - A', attendance: 98, status: 'Active' },
                { name: 'Evan Wright', email: 'evan.w@student.edu', roll: 'CS24-005', batch: 'Sem 4 - B1', attendance: 45, status: 'Critical' },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{student.roll}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">{student.batch}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${student.attendance > 75 ? 'bg-emerald-500' : student.attendance > 60 ? 'bg-orange-500' : 'bg-red-500'}`} 
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className={`font-semibold ${student.attendance > 75 ? 'text-emerald-700' : student.attendance > 60 ? 'text-orange-700' : 'text-red-700'}`}>
                        {student.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 
                        student.status === 'Warning' ? 'bg-orange-50 text-orange-700' : 
                        'bg-red-50 text-red-700'}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="View Profile">
                        <Eye size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Message">
                        <Mail size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1 to 5 of 248 students</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">Next</button>
          </div>
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
          The {title.toLowerCase()} module is ready for integration. Connect your grading and assessment API to display this data.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'students-list':
      return renderStudentList();
    case 'students-profiles':
      return renderPlaceholder('Student Profiles', Users);
    case 'students-progress':
      return renderPlaceholder('Academic Progress', TrendingUp);
    case 'students-marks':
      return renderPlaceholder('Internal Marks', Award);
    default:
      return renderPlaceholder('Student Management', Users);
  }
}
