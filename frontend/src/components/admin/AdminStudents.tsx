import { useState } from 'react';
import { Search, Filter, Download, UserPlus, GraduationCap, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminStudents({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for students
  const students = [
    { id: 'STU001', name: 'Arjun Das', course: 'B.Tech CS', year: '3rd Year', attendance: '92%', grade: 'A', status: 'Active' },
    { id: 'STU002', name: 'Neha Gupta', course: 'B.Tech IT', year: '2nd Year', attendance: '85%', grade: 'B+', status: 'Active' },
    { id: 'STU003', name: 'Rohan Mehra', course: 'B.Com', year: '1st Year', attendance: '74%', grade: 'C', status: 'Warning' },
    { id: 'STU004', name: 'Kavya Singh', course: 'B.Sc Physics', year: '3rd Year', attendance: '98%', grade: 'A+', status: 'Active' },
    { id: 'STU005', name: 'Siddharth Jain', course: 'BBA', year: '2nd Year', attendance: '65%', grade: 'D', status: 'Critical' },
  ];

  const renderStudentList = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Directory</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <UserPlus size={18} /> Add Student
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students by name, ID, or course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Course Details</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{student.course}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{student.year}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{student.attendance}</span>
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            parseInt(student.attendance) > 85 ? 'bg-emerald-500' :
                            parseInt(student.attendance) > 75 ? 'bg-orange-500' : 'bg-rose-500'
                          }`}
                          style={{ width: student.attendance }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      student.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      student.status === 'Warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="View Profile">
                        <Eye size={18} />
                      </button>
                      <button className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
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

  const renderAddStudent = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
        <UserPlus size={40} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Student Registration Form</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        This comprehensive form allows for manual entry of new student records into the ERP system.
      </p>
    </div>
  );

  const renderAcademicRecords = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
        <GraduationCap size={40} className="text-purple-600 dark:text-purple-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Academic Records</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        View and manage past semesters, transcripts, and degree progress for all students.
      </p>
    </div>
  );

  const renderStudentProfiles = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Profiles</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => (
          <div key={student.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl mb-4">
              {student.name.charAt(0)}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">{student.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{student.course} • {student.year}</p>
            <div className="w-full grid grid-cols-2 gap-4 mb-6 border-t border-b border-slate-100 dark:border-slate-800 py-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Attendance</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{student.attendance}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Grade</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{student.grade}</p>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              View Full Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudentAttendance = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
          <Edit size={18} /> Edit Attendance
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Courses</option>
            <option>B.Tech CS</option>
            <option>B.Tech IT</option>
            <option>BBA</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Student</th>
                <th className="p-4">Total Classes</th>
                <th className="p-4">Attended</th>
                <th className="p-4">Overall %</th>
                <th className="p-4 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-800 dark:text-slate-200">{student.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">120</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{Math.floor(120 * (parseInt(student.attendance) / 100))}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{student.attendance}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <span className={`px-2 py-1 text-xs font-bold rounded text-white ${
                      parseInt(student.attendance) >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {parseInt(student.attendance) >= 75 ? 'Regular' : 'Defaulter'}
                    </span>
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
    case 'students-list':
      return renderStudentList();
    case 'students-add':
      return renderAddStudent();
    case 'students-profiles':
      return renderStudentProfiles();
    case 'students-attendance':
      return renderStudentAttendance();
    case 'students-academic':
      return renderAcademicRecords();
    default:
      return renderStudentList();
  }
}
