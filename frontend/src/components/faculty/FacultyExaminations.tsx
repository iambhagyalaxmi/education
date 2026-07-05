import { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Award
} from 'lucide-react';

interface FacultyExaminationsProps {
  activeTab: string;
}

export default function FacultyExaminations({ activeTab }: FacultyExaminationsProps) {
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const handleSubmitExam = () => {
    setIsSubmittingExam(true);
    setTimeout(() => {
      setIsSubmittingExam(false);
      setIsExamSubmitted(true);
      setTimeout(() => setIsExamSubmitted(false), 3000);
    }, 1500);
  };

  const renderUploadQuestionPapers = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Upload Question Papers</h2>
        <button 
          onClick={handleSubmitExam}
          disabled={isSubmittingExam || isExamSubmitted}
          className={`px-4 py-2 font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2
            ${isExamSubmitted ? 'bg-emerald-100 text-emerald-700 cursor-default' : 
              isSubmittingExam ? 'bg-emerald-400 text-white cursor-not-allowed' : 
              'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
          {isSubmittingExam ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Submitting...
            </>
          ) : isExamSubmitted ? (
            <>
              <CheckCircle2 size={18} />
              Submitted Successfully
            </>
          ) : (
            'Submit to Exam Branch'
          )}
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Examination Type</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Mid-Term 1</option>
              <option>Mid-Term 2</option>
              <option>End Semester</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Paper (PDF)</label>
          <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-emerald-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-emerald-800">Click to upload securely</p>
            <p className="text-xs text-emerald-600/70 mt-1">Only PDF files are accepted for security reasons.</p>
          </div>
        </div>
        
        <div className="mt-6 flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>Please ensure that the question paper follows the standard university template and is completely vetted. Once submitted to the Exam Branch, it cannot be recalled.</p>
        </div>
      </div>
    </div>
  );

  const renderEnterMarks = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Enter Examination Marks</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>CS401: Data Structures</option>
          </select>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>Mid-Term 1 (Theory)</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            Lock Marks
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by Roll No..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Download size={16}/> Import CSV</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Part A (10)</th>
                <th className="px-6 py-4">Part B (20)</th>
                <th className="px-6 py-4">Total (30)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { roll: 'CS24-001', name: 'Alice Smith', p1: '8', p2: '16', total: 24, status: 'Saved' },
                { roll: 'CS24-002', name: 'Bob Johnson', p1: '6', p2: '14', total: 20, status: 'Saved' },
                { roll: 'CS24-003', name: 'Charlie Davis', p1: '', p2: '', total: 0, status: 'Pending' },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{student.roll}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4">
                    <input type="text" defaultValue={student.p1} className="w-16 px-2 py-1.5 border border-slate-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="text" defaultValue={student.p2} className="w-16 px-2 py-1.5 border border-slate-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{student.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                      ${student.status === 'Saved' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {student.status === 'Saved' ? <CheckCircle2 size={14}/> : null}
                      {student.status}
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

  const renderInternalAssessment = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Internal Assessment Management</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>CS401: Data Structures</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            Calculate Internals
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by Roll No..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Download size={16}/> Export Internals</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Mid-Term 1 (30)</th>
                <th className="px-6 py-4">Mid-Term 2 (30)</th>
                <th className="px-6 py-4">Assignments (20)</th>
                <th className="px-6 py-4">Attendance (20)</th>
                <th className="px-6 py-4">Total Internal (100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { roll: 'CS24-001', name: 'Alice Smith', mt1: 24, mt2: 26, assign: 18, att: 20, total: 88 },
                { roll: 'CS24-002', name: 'Bob Johnson', mt1: 20, mt2: 22, assign: 16, att: 18, total: 76 },
                { roll: 'CS24-003', name: 'Charlie Davis', mt1: 15, mt2: 18, assign: 12, att: 10, total: 55 },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{student.roll}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4">{student.mt1}</td>
                  <td className="px-6 py-4">{student.mt2}</td>
                  <td className="px-6 py-4">{student.assign}</td>
                  <td className="px-6 py-4">{student.att}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{student.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinalAssessment = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Final Assessment Processing</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 text-center max-w-2xl mx-auto mt-12">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award size={40} className="text-blue-600"/>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Generate Final Grades</h3>
        <p className="text-slate-500 mb-8">Process final grades by combining Internal Assessment (50%) and End Semester Examination marks (50%) for <strong>CS401: Data Structures</strong>.</p>
        
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="font-medium text-slate-700">Internal Marks Locked</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">COMPLETED</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="font-medium text-slate-700">End Semester Marks Uploaded</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">COMPLETED</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
              <span className="font-medium text-slate-700">Final Grade Calculation</span>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">PENDING</span>
          </div>
        </div>

        <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl w-full text-lg">
          Calculate & Publish Final Grades
        </button>
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
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage examination workflows.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'exams-upload':
      return renderUploadQuestionPapers();
    case 'exams-marks':
      return renderEnterMarks();
    case 'exams-internal':
      return renderInternalAssessment();
    case 'exams-final':
      return renderFinalAssessment();
    default:
      return renderPlaceholder('Examinations Management', FileText);
  }
}
