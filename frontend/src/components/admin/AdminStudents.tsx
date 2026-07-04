import { useState, useEffect } from 'react';
import { Search, Filter, Download, UserPlus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminStudents({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [courses, setCourses] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    courseId: '',
    batchId: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      console.error(err);
      // Fallback data if backend is down
      setStudents([
        { id: 'STU001', firstName: 'Arjun', lastName: 'Das', course: { name: 'B.Tech CS' }, batch: { academicYear: '2024-2027' }, attendance: '92%', grade: 'A', status: 'active' },
        { id: 'STU002', firstName: 'Neha', lastName: 'Gupta', course: { name: 'B.Tech IT' }, batch: { academicYear: '2023-2026' }, attendance: '85%', grade: 'B+', status: 'active' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
    fetch('/api/courses').then(r => r.json()).then(setCourses).catch(console.error);
  }, [activeTab]);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Registration failed');
      setSuccessMsg('Student registered successfully!');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', courseId: '', batchId: '' });
      fetchStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

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
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase">
                        {student.firstName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{student.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{student.course?.name || 'Unassigned'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{student.batch?.academicYear || 'N/A'}</p>
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
              {students.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No students found. Register a new student to see them here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAddStudent = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Registration Form</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter details to manually register a new student.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8">
        {error && <div className="p-4 mb-6 bg-rose-50 text-rose-700 rounded-lg">{error}</div>}
        {successMsg && <div className="p-4 mb-6 bg-emerald-50 text-emerald-700 rounded-lg">{successMsg}</div>}
        
        <form className="space-y-8" onSubmit={handleRegister}>
          
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
                <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. Rahul" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
                <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. Sharma" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="rahul@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Birth *</label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gender *</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Course *</label>
                <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value, batchId: ''})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm">
                  <option value="">Select Course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Batch *</label>
                <select required value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" disabled={!formData.courseId}>
                  <option value="">Select Batch...</option>
                  {formData.courseId && courses.find(c => c.id === formData.courseId)?.batches?.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.academicYear}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Previous Qualifications</label>
                <textarea rows={3} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Enter details of previous high school or degrees..."></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => {setError(''); setSuccessMsg(''); setFormData({firstName: '', lastName: '', email: '', phone: '', courseId: '', batchId: ''})}} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Clear
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
              {loading ? 'Registering...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAcademicRecords = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Academic Records</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and view past semester records and transcripts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <Download size={18} /> Export All
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex gap-4 w-full md:w-auto">
            <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Batch 2024</option>
              <option>Batch 2023</option>
              <option>Batch 2022</option>
            </select>
            <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Semester 6</option>
              <option>Semester 5</option>
              <option>Semester 4</option>
            </select>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Student ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Course</th>
                <th className="p-4">SGPA</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Grade</th>
                <th className="p-4 pr-6 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => {
                const sgpa = (Math.random() * (9.8 - 6.5) + 6.5).toFixed(2);
                const cgpa = (Math.random() * (9.5 - 6.8) + 6.8).toFixed(2);
                return (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-500 dark:text-slate-400">{student.id}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{student.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{student.course}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{sgpa}</td>
                    <td className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">{cgpa}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                        parseFloat(cgpa) >= 8.5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                        parseFloat(cgpa) >= 7.5 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                      }`}>
                        {parseFloat(cgpa) >= 8.5 ? 'A+' : parseFloat(cgpa) >= 7.5 ? 'A' : 'B'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors flex items-center justify-end gap-1 w-full">
                        View <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No academic records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
        {students.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 dark:text-slate-400">
            No student profiles found.
          </div>
        )}
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
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              )}
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
