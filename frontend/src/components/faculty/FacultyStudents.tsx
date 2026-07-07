import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Mail, 
  Eye,
  TrendingUp,
  Award,
  X,
  Save,
  UserPlus
} from 'lucide-react';

interface FacultyStudentsProps {
  activeTab: string;
}

export default function FacultyStudents({ activeTab }: FacultyStudentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: 'Alice Smith',
    email: 'alice.smith@student.edu',
    phone: '+1 (555) 123-4567',
    dob: 'May 14, 2004'
  });

  const MOCK_STUDENTS = [
    { name: 'Alice Smith', email: 'alice.smith@student.edu', roll: 'CS24-001', batch: 'Sem 4 - B1', attendance: 92, status: 'Active' },
    { name: 'Bob Johnson', email: 'bob.j@student.edu', roll: 'CS24-002', batch: 'Sem 4 - B1', attendance: 85, status: 'Active' },
    { name: 'Charlie Davis', email: 'charlie.d@student.edu', roll: 'CS24-003', batch: 'Sem 4 - B2', attendance: 65, status: 'Warning' },
    { name: 'Diana Prince', email: 'diana.p@student.edu', roll: 'CS24-004', batch: 'Sem 6 - A', attendance: 98, status: 'Active' },
    { name: 'Evan Wright', email: 'evan.w@student.edu', roll: 'CS24-005', batch: 'Sem 4 - B1', attendance: 45, status: 'Critical' },
    { name: 'Fiona Gallagher', email: 'fiona.g@student.edu', roll: 'CS24-006', batch: 'Sem 4 - B1', attendance: 78, status: 'Active' },
    { name: 'George Harrison', email: 'george.h@student.edu', roll: 'CS24-007', batch: 'Sem 4 - B2', attendance: 88, status: 'Active' },
    { name: 'Hannah Abbott', email: 'hannah.a@student.edu', roll: 'CS24-008', batch: 'Sem 6 - A', attendance: 95, status: 'Active' },
    { name: 'Ian Malcolm', email: 'ian.m@student.edu', roll: 'CS24-009', batch: 'Sem 4 - B1', attendance: 55, status: 'Critical' },
    { name: 'Julia Roberts', email: 'julia.r@student.edu', roll: 'CS24-010', batch: 'Sem 4 - B2', attendance: 72, status: 'Warning' },
    { name: 'Kevin Hart', email: 'kevin.h@student.edu', roll: 'CS24-011', batch: 'Sem 6 - A', attendance: 91, status: 'Active' },
    { name: 'Laura Dern', email: 'laura.d@student.edu', roll: 'CS24-012', batch: 'Sem 4 - B1', attendance: 89, status: 'Active' },
    { name: 'Mike Ross', email: 'mike.r@student.edu', roll: 'CS24-013', batch: 'Sem 4 - B2', attendance: 82, status: 'Active' },
    { name: 'Nina Dobrev', email: 'nina.d@student.edu', roll: 'CS24-014', batch: 'Sem 6 - A', attendance: 97, status: 'Active' },
    { name: 'Oliver Twist', email: 'oliver.t@student.edu', roll: 'CS24-015', batch: 'Sem 4 - B1', attendance: 68, status: 'Warning' },
  ];

  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', roll: '', batch: '', profilePic: '' });

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = {
      name: addForm.name,
      email: addForm.email,
      roll: addForm.roll,
      batch: addForm.batch,
      profilePic: addForm.profilePic,
      attendance: 100,
      status: 'Active'
    };
    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    setAddForm({ name: '', email: '', roll: '', batch: '', profilePic: '' });
  };

  const renderStudentList = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Student List</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center">
            <Download size={18} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex-1 sm:flex-none justify-center">
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
              {paginatedStudents.map((student, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm overflow-hidden">
                        {(student as any).profilePic ? (
                          <img src={(student as any).profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
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
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4">
          <div>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, MOCK_STUDENTS.length)} of {MOCK_STUDENTS.length} students</div>
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto justify-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded transition-colors ${currentPage === page ? 'bg-emerald-600 text-white' : 'border border-slate-200 hover:bg-slate-50'}`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentProfiles = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Student Profiles</h2>
        <div className="relative w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold mb-4">
              {editForm.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{editForm.name}</h3>
            <p className="text-sm text-slate-500 mb-4">CS24-001 • B.Tech Computer Science</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => window.location.href = `mailto:${editForm.email}`} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">Message</button>
              <button onClick={() => setShowEditModal(true)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">Edit</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6 space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-slate-700 font-medium">{editForm.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Phone</p>
              <p className="text-sm text-slate-700 font-medium">{editForm.phone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Date of Birth</p>
              <p className="text-sm text-slate-700 font-medium">{editForm.dob}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Academic Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">CGPA</p>
                <p className="text-2xl font-bold text-emerald-600">3.84</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Attendance</p>
                <p className="text-2xl font-bold text-blue-600">92%</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Rank</p>
                <p className="text-2xl font-bold text-purple-600">12 / 120</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Enrolled Courses (Current Sem)</h3>
            <div className="space-y-3">
              {[
                { course: 'Data Structures & Algorithms', code: 'CS401', grade: 'A', progress: 85 },
                { course: 'Operating Systems', code: 'CS402', grade: 'A-', progress: 78 },
                { course: 'Database Management Systems', code: 'CS403', grade: 'B+', progress: 92 }
              ].map((c, i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">{c.course}</h4>
                    <p className="text-xs text-slate-500">{c.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-lg">{c.grade}</p>
                    <p className="text-xs text-slate-500">Predicted</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInternalMarks = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Internal Marks Entry</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>CS401: Data Structures</option>
            <option>CS402: Operating Systems</option>
          </select>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>Mid-Term Exam</option>
            <option>Assignment 1</option>
            <option>Quiz 1</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            Save Marks
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800">Mid-Term Examination</h3>
            <p className="text-sm text-slate-500">Max Marks: 50 • Weightage: 20%</p>
          </div>
          <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Download size={16}/> Import CSV</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Marks Obtained (Out of 50)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { roll: 'CS24-001', name: 'Alice Smith', marks: '45', status: 'Passed' },
                { roll: 'CS24-002', name: 'Bob Johnson', marks: '38', status: 'Passed' },
                { roll: 'CS24-003', name: 'Charlie Davis', marks: '15', status: 'Failed' },
                { roll: 'CS24-004', name: 'Diana Prince', marks: '48', status: 'Passed' },
                { roll: 'CS24-005', name: 'Evan Wright', marks: '-', status: 'Absent' },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{student.roll}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      defaultValue={student.marks}
                      className={`w-20 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center font-medium
                        ${student.status === 'Failed' ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200'}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                      ${student.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 
                        student.status === 'Failed' ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-600'}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input type="text" placeholder="Add remark..." className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAcademicProgress = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Academic Progress Tracker</h2>
        <div className="relative w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">AS</div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Alice Smith - Progress Report</h3>
            <p className="text-sm text-slate-500">CS24-001 • B.Tech Computer Science (Sem 4)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-600"/> Semester CGPA Trend</h4>
            <div className="space-y-4">
              {[
                { sem: 'Semester 1', gpa: 3.75 },
                { sem: 'Semester 2', gpa: 3.82 },
                { sem: 'Semester 3', gpa: 3.90 },
                { sem: 'Semester 4 (Current)', gpa: 3.84 },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-slate-600">{s.sem}</div>
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(s.gpa / 4) * 100}%` }} />
                  </div>
                  <div className="w-10 text-right text-sm font-bold text-slate-800">{s.gpa.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Award size={18} className="text-purple-600"/> Skill Badges Earned</h4>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm flex items-center gap-1">🥇 Data Structures</span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm flex items-center gap-1">🥈 Python Basic</span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm flex items-center gap-1">🏆 Perfect Attendance</span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm flex items-center gap-1">🌟 Top 10% Batch</span>
            </div>
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

  const renderContent = () => {
    switch (activeTab) {
      case 'students-list':
        return renderStudentList();
      case 'students-profiles':
        return renderStudentProfiles();
      case 'students-progress':
        return renderAcademicProgress();
      case 'students-marks':
        return renderInternalMarks();
      default:
        return renderPlaceholder('Student Management', Users);
    }
  };

  return (
    <>
      {renderContent()}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Edit Student Record</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input type="text" value={editForm.dob} onChange={(e) => setEditForm({...editForm, dob: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setShowEditModal(false)} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative mb-2">
                  {addForm.profilePic ? (
                    <img src={addForm.profilePic} alt="Profile preview" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <UserPlus size={28} />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formDataUpload = new FormData();
                    formDataUpload.append('image', file);
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                      const data = await res.json();
                      if (data.url) setAddForm({...addForm, profilePic: data.url});
                    } catch (err) {
                      console.error('Upload failed', err);
                    }
                  }}
                  className="text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 max-w-[200px]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                <input required type="text" value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                <input required type="email" value={addForm.email} onChange={(e) => setAddForm({...addForm, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Roll No *</label>
                <input required type="text" value={addForm.roll} onChange={(e) => setAddForm({...addForm, roll: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Course Batch *</label>
                <input required type="text" placeholder="e.g. Sem 4 - B1" value={addForm.batch} onChange={(e) => setAddForm({...addForm, batch: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
                  <Save size={18} /> Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
