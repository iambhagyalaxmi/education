import { 
  FileEdit, 
  Upload, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';

interface FacultyAssignmentsProps {
  activeTab: string;
}

export default function FacultyAssignments({ activeTab }: FacultyAssignmentsProps) {

  const renderCreateAssignment = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Create Assignment</h2>
        <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
          Publish Assignment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>CS401: Data Structures</option>
              <option>CS402: Operating Systems</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Assignment Title</label>
            <input type="text" placeholder="e.g. Implementation of AVL Trees" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
            <input type="datetime-local" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Marks</label>
            <input type="number" placeholder="100" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Instructions / Description</label>
          <textarea rows={5} placeholder="Write detailed instructions for the assignment..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Attach Files (Optional)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewSubmissions = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Review Submissions</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>Assignment 1: Trees</option>
            <option>Assignment 2: Graphs</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-slate-800">120</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-b-4 border-b-emerald-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Submitted</p>
          <p className="text-3xl font-bold text-emerald-600">105</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-b-4 border-b-orange-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-orange-600">42</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-b-4 border-b-red-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Not Submitted</p>
          <p className="text-3xl font-bold text-red-600">15</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search student..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { name: 'Alice Smith', roll: 'CS24-001', date: 'Oct 22, 14:30', status: 'Graded', grade: '95/100', color: 'emerald' },
                { name: 'Bob Johnson', roll: 'CS24-002', date: 'Oct 22, 16:45', status: 'Pending Review', grade: '-', color: 'orange' },
                { name: 'Charlie Davis', roll: 'CS24-003', date: '-', status: 'Missing', grade: '0/100', color: 'red' },
                { name: 'Diana Prince', roll: 'CS24-004', date: 'Oct 23, 09:15', status: 'Graded', grade: '88/100', color: 'emerald' },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{student.name}</div>
                    <div className="text-xs text-slate-500">{student.roll}</div>
                  </td>
                  <td className="px-6 py-4">{student.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-${student.color}-50 text-${student.color}-700`}>
                      {student.status === 'Graded' ? <CheckCircle2 size={14}/> : student.status === 'Missing' ? <AlertCircle size={14}/> : <Clock size={14}/>}
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{student.grade}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-colors">
                      {student.status === 'Pending Review' ? 'Grade Now' : 'View'}
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
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage assignment workflows.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'assignments-create':
      return renderCreateAssignment();
    case 'assignments-review':
      return renderReviewSubmissions();
    case 'assignments-grade':
      return renderPlaceholder('Grade Assignments', FileEdit);
    case 'assignments-publish':
      return renderPlaceholder('Publish Results', Download);
    default:
      return renderPlaceholder('Assignment Management', FileEdit);
  }
}
