import { useState, useEffect } from 'react';
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


interface AttendanceRow {
  id?: string;
  studentId?: string;
  studentName: string;
  rollNo: string;
  course: string;
  date: string;
  timeSlot: string;
  status: string;
  percent: number;
}

export default function FacultyAttendance({ activeTab }: FacultyAttendanceProps) {
  const [students, setStudents] = useState<AttendanceRow[]>([]);
  const [editRecords, setEditRecords] = useState<AttendanceRow[]>([]);
  const [allDefaulters, setAllDefaulters] = useState<AttendanceRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showAllDefaulters, setShowAllDefaulters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('CS401: Data Structures - Batch A');
  const [selectedSlot, setSelectedSlot] = useState('09:00 AM - 10:00 AM');
  const [editDate, setEditDate] = useState(new Date().toISOString().split('T')[0]);
  const [editCourse, setEditCourse] = useState('CS401: Data Structures - Batch A');
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Load students for take-attendance session from DB
  const loadStudentsForSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data.map((s: any) => ({
          studentId: s.id,
          studentName: `${s.firstName} ${s.lastName}`,
          rollNo: s.id.slice(0, 8).toUpperCase(),
          course: selectedCourse,
          date: today,
          timeSlot: selectedSlot,
          status: 'present',
          percent: 85,
        })));
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  // Load attendance records for editing
  const loadEditRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/attendance?course=${encodeURIComponent(editCourse)}&date=${editDate}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setEditRecords(data);
      } else {
        // Load students to create blank edit records
        const stuRes = await fetch('/api/students');
        const stuData = await stuRes.json();
        if (Array.isArray(stuData)) {
          setEditRecords(stuData.map((s: any) => ({
            studentId: s.id,
            studentName: `${s.firstName} ${s.lastName}`,
            rollNo: s.id.slice(0, 8).toUpperCase(),
            course: editCourse,
            date: editDate,
            timeSlot: '09:00 AM - 10:00 AM',
            status: 'present',
            percent: 0,
          })));
        }
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  // Load defaulters from DB
  const loadDefaulters = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllDefaulters(data.filter((r: AttendanceRow) => r.percent < 75));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeTab === 'attendance-reports') loadDefaulters();
  }, [activeTab]);

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;

  const markAll = (status: string) => setStudents(students.map(s => ({ ...s, status })));

  const updateStatus = (index: number, status: string) => {
    const n = [...students];
    n[index].status = status;
    setStudents(n);
  };

  const updateEditStatus = (index: number, status: string) => {
    const n = [...editRecords];
    n[index].status = status;
    setEditRecords(n);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: students }),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // For records with IDs, update individually
      const withId = editRecords.filter(r => r.id);
      await Promise.all(withId.map(r =>
        fetch(`/api/attendance?id=${r.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: r.status }),
        })
      ));
      // For new records, submit them
      const without = editRecords.filter(r => !r.id);
      if (without.length > 0) {
        await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records: without }),
        });
      }
      setShowEditSuccess(true);
      setTimeout(() => setShowEditSuccess(false), 3000);
    } catch (e) { console.error(e); }
    setIsUpdating(false);
  };

  const exportToCSV = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      const defaulters = Array.isArray(data) ? data.filter((r: AttendanceRow) => r.percent < 75) : [];
      const csvContent = [
        ['Roll No', 'Student Name', 'Course', 'Attendance %'],
        ...defaulters.map((r: AttendanceRow) => [r.rollNo, r.studentName, r.course, r.percent.toString()])
      ].map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', 'attendance_defaulters_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) { console.error(e); }
  };

  const displayedDefaulters = showAllDefaulters ? allDefaulters : allDefaulters.slice(0, 3);

  const renderTakeAttendance = () => (
    <div className="space-y-6 animate-fade-in-up">
      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <p className="font-medium">Attendance successfully submitted and saved to database.</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Take Attendance</h2>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2">
            <Calendar size={18} /> Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || students.length === 0}
            className={`px-4 py-2 font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2
              ${isSubmitting || students.length === 0 ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
          >
            {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
            {isSubmitting ? 'Saving...' : 'Submit Attendance'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option>CS401: Data Structures - Batch A</option>
            <option>CS402: Operating Systems - Batch B</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Time Slot</label>
          <select
            value={selectedSlot}
            onChange={e => setSelectedSlot(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option>09:00 AM - 10:00 AM</option>
            <option>10:00 AM - 11:00 AM</option>
          </select>
        </div>
        <button
          onClick={loadStudentsForSession}
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load Students'}
        </button>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="relative max-w-sm w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search student..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                Present: <span className="text-emerald-600">{presentCount}</span> | Absent: <span className="text-red-600">{absentCount}</span>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <button onClick={() => markAll('present')} className="px-3 py-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">Mark All Present</button>
                <button onClick={() => markAll('absent')} className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Mark All Absent</button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{student.rollNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">{student.studentName.charAt(0)}</div>
                        <span className="font-semibold text-slate-900">{student.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(i, 'present')} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${student.status === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                          <CheckCircle2 size={16} /> Present
                        </button>
                        <button onClick={() => updateStatus(i, 'absent')} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${student.status === 'absent' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                          <XCircle size={16} /> Absent
                        </button>
                        <button onClick={() => updateStatus(i, 'late')} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${student.status === 'late' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                          <AlertCircle size={16} /> Late
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {students.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500">
          Select a course and click <strong>Load Students</strong> to begin.
        </div>
      )}
    </div>
  );

  const renderAttendanceReports = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Attendance Reports</h2>
        <button onClick={exportToCSV} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4"><AlertCircle size={32} /></div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{allDefaulters.length}</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Students Below 75%</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4"><CheckSquare size={32} /></div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{allDefaulters.length === 0 ? '—' : 'See List'}</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Defaulters Tracked</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4"><Calendar size={32} /></div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">Live</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Data from Database</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Defaulters List (Below 75%)</h3>
          <button onClick={() => setShowAllDefaulters(!showAllDefaulters)} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            {showAllDefaulters ? 'View Less' : 'View All'}
          </button>
        </div>
        {allDefaulters.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No defaulters found in the database.</div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedDefaulters.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{s.rollNo}</td>
                  <td className="px-6 py-4 font-semibold">{s.studentName}</td>
                  <td className="px-6 py-4">{s.course}</td>
                  <td className="px-6 py-4"><span className={`font-bold ${s.percent < 60 ? 'text-red-600' : 'text-orange-600'}`}>{s.percent}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderEditAttendance = () => (
    <div className="space-y-6 animate-fade-in-up">
      {showEditSuccess && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={20} className="text-blue-600" />
          <p className="font-medium">Attendance successfully updated in database.</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Edit Attendance</h2>
        <button
          onClick={handleUpdate}
          disabled={isUpdating || editRecords.length === 0}
          className={`px-6 py-2.5 font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2
            ${isUpdating || editRecords.length === 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          {isUpdating ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
          {isUpdating ? 'Saving...' : 'Save Updates'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
          <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
          <select value={editCourse} onChange={e => setEditCourse(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>CS401: Data Structures - Batch A</option>
            <option>CS402: Operating Systems - Batch B</option>
          </select>
        </div>
        <button onClick={loadEditRecords} disabled={isLoading} className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          {isLoading ? 'Loading...' : 'Load Records'}
        </button>
      </div>

      {editRecords.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {editRecords.map((student, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{student.rollNo}</td>
                    <td className="px-6 py-4 font-semibold">{student.studentName}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => updateEditStatus(i, 'present')} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium ${student.status === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                          <CheckCircle2 size={16} /> Present
                        </button>
                        <button onClick={() => updateEditStatus(i, 'absent')} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium ${student.status === 'absent' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                          <XCircle size={16} /> Absent
                        </button>
                        <button onClick={() => updateEditStatus(i, 'late')} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium ${student.status === 'late' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                          <AlertCircle size={16} /> Late
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {editRecords.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500">
          Select a date and course, then click <strong>Load Records</strong>.
        </div>
      )}
    </div>
  );

  switch (activeTab) {
    case 'attendance-take': return renderTakeAttendance();
    case 'attendance-edit': return renderEditAttendance();
    case 'attendance-reports': return renderAttendanceReports();
    default: return renderTakeAttendance();
  }
}
