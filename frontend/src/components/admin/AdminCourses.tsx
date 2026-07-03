import { useState } from 'react';
import { Search, Filter, Download, Plus, Book, BookOpen, Layers, Edit, Trash2, Calendar } from 'lucide-react';

export default function AdminCourses({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const courses = [
    { id: 'CS101', name: 'B.Tech Computer Science', dept: 'Computer Science', duration: '4 Years', credits: 160, status: 'Active' },
    { id: 'IT102', name: 'B.Tech Information Tech', dept: 'Information Tech', duration: '4 Years', credits: 160, status: 'Active' },
    { id: 'BBA201', name: 'Bachelor of Business Admin', dept: 'Business Admin', duration: '3 Years', credits: 120, status: 'Active' },
    { id: 'ME301', name: 'B.Tech Mechanical', dept: 'Mechanical', duration: '4 Years', credits: 164, status: 'Active' },
  ];

  const renderCourseList = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Courses Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage academic programs and degree courses.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Course
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
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
                <th className="p-4 pl-6">Course Details</th>
                <th className="p-4">Department</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Book size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{course.name}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{course.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{course.dept}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{course.duration}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{course.credits}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
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

  const renderSubjects = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Subject Master</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage individual subjects and their mappings.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Subject
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, type: 'Core', course: 'B.Tech CS' },
          { code: 'CS302', name: 'Database Management Systems', credits: 3, type: 'Core', course: 'B.Tech CS' },
          { code: 'IT405', name: 'Cloud Computing', credits: 3, type: 'Elective', course: 'B.Tech IT' },
          { code: 'MATH201', name: 'Engineering Mathematics', credits: 4, type: 'Core', course: 'Common' },
          { code: 'MGT101', name: 'Principles of Management', credits: 3, type: 'Core', course: 'BBA' },
        ].map((subject, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-100 dark:border-indigo-800">
                {subject.code}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{subject.name}</h3>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
              <p>Program: <span className="font-semibold text-slate-700 dark:text-slate-300">{subject.course}</span></p>
              <p>Credits: <span className="font-semibold text-slate-700 dark:text-slate-300">{subject.credits}</span></p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                subject.type === 'Core' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
              }`}>{subject.type} SUBJECT</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSyllabus = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
        <BookOpen size={40} className="text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Syllabus Repository</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        Upload, manage, and distribute course syllabus documents to students and faculty.
      </p>
      <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
        Upload Syllabus PDF
      </button>
    </div>
  );

  const renderSemester = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Semester Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure academic terms, dates, and active status.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Calendar size={18} /> New Semester
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Academic Term</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                <th className="p-4">Working Days</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { term: 'Spring 2024 (Even)', start: 'Jan 15, 2024', end: 'May 30, 2024', days: 95, status: 'Active' },
                { term: 'Fall 2023 (Odd)', start: 'Aug 10, 2023', end: 'Dec 20, 2023', days: 92, status: 'Completed' },
                { term: 'Spring 2023 (Even)', start: 'Jan 12, 2023', end: 'May 25, 2023', days: 90, status: 'Completed' },
              ].map((sem, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-indigo-500" />
                      {sem.term}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{sem.start}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{sem.end}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{sem.days}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      sem.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {sem.status}
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

  switch (activeTab) {
    case 'courses-list':
      return renderCourseList();
    case 'courses-subjects':
      return renderSubjects();
    case 'courses-syllabus':
      return renderSyllabus();
    case 'courses-semester':
      return renderSemester();
    default:
      return renderCourseList();
  }
}
