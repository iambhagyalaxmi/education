import { useState, useEffect } from 'react';
import { Plus, Book, Edit, Trash2, X, CheckCircle } from 'lucide-react';

export default function AdminCourses({ activeTab }: { activeTab: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  
  // Forms
  const [courseForm, setCourseForm] = useState({ code: '', name: '', durationYears: '4', description: '' });
  const [batchForm, setBatchForm] = useState({ courseId: '', academicYear: '', startYear: '', endYear: '' });
  const [subjectForm, setSubjectForm] = useState({ courseId: '', code: '', name: '', semester: '1', credits: '3', type: 'core' });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/courses?t=${new Date().getTime()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        setError('Failed to fetch courses. Please make sure the backend server is running.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Network error: Could not fetch courses. Is your backend server running on port 5000?');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, [activeTab]);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      });
      if (!res.ok) {
        let errMsg = 'Failed to add course';
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }
      setSuccess('Course added successfully!');
      setCourseForm({ code: '', name: '', durationYears: '4', description: '' });
      setShowAddCourse(false);
      fetchCourses();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchForm)
      });
      if (!res.ok) {
        let errMsg = 'Failed to add batch';
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }
      setSuccess('Batch added successfully!');
      setBatchForm({ courseId: '', academicYear: '', startYear: '', endYear: '' });
      setShowAddBatch(false);
      fetchCourses();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      const res = await fetch(`/api/batches?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete batch');
      setSuccess('Batch deleted successfully!');
      fetchCourses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)));
    }
  };


  const fetchSubjects = async () => {
    try {
      const res = await fetch(`/api/subjects?t=${new Date().getTime()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectForm)
      });
      if (!res.ok) {
        let errMsg = 'Failed to add subject';
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }
      setSuccess('Subject added successfully!');
      setSubjectForm({ courseId: '', code: '', name: '', semester: '1', credits: '3', type: 'core' });
      setShowAddSubject(false);
      fetchSubjects();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      const res = await fetch(`/api/subjects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete subject');
      setSuccess('Subject deleted successfully!');
      fetchSubjects();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)));
    }
  };

  const renderCourseList = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Courses Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage academic programs and degree courses.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddCourse(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={18} /> Add Course
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Course Details</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Batches</th>
                <th className="p-4">Actions</th>
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
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{course.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{course.durationYears} Years</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                    {course.batches?.length || 0} batches
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex gap-2">
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
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No courses found. Add a course to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>{/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Batch</h3>
              <button onClick={() => setShowAddBatch(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddBatch} className="p-6 space-y-4">
              {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
                <select required value={batchForm.courseId} onChange={e => setBatchForm({...batchForm, courseId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                  <option value="">Select a course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Year</label>
                <input required type="text" value={batchForm.academicYear} onChange={e => setBatchForm({...batchForm, academicYear: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. 2024-2028" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Year</label>
                  <input required type="number" value={batchForm.startYear} onChange={e => setBatchForm({...batchForm, startYear: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">End Year</label>
                  <input required type="number" value={batchForm.endYear} onChange={e => setBatchForm({...batchForm, endYear: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="2028" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddBatch(false)} className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {loading ? 'Adding...' : 'Save Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderBatchManagement = () => {
    const allBatches = courses.flatMap(c => 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c.batches || []).map((b: any) => ({
        ...b,
        courseName: c.name,
        courseCode: c.code
      }))
    ).sort((a, b) => b.startYear - a.startYear);

    return (
      <div className="space-y-6 animate-fade-in-up pb-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Batch Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage academic batches and intakes across all courses.</p>
          </div>
          <button onClick={() => setShowAddBatch(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={18} /> Add New Batch
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Course</th>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{batch.courseName}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{batch.courseCode}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold rounded-full text-sm">
                        {batch.academicYear}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-400">
                      {batch.startYear} - {batch.endYear}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDeleteBatch(batch.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {allBatches.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No batches found. Add a batch to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };


  const renderSubjectsManagement = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Subjects Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage curriculum for all courses</p>
        </div>
        <button onClick={() => setShowAddSubject(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg font-medium">
          <Plus size={20} /> Add New Subject
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 pl-6 font-semibold text-slate-600 dark:text-slate-300">Code</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Course</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Sem</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Credits</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Type</th>
                <th className="p-4 pr-6 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-700 dark:text-slate-300">{subject.code}</td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{subject.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{subject.course?.name || 'N/A'}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg text-sm font-bold">
                      {subject.semester}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{subject.credits}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase ${
                      subject.type === 'core' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      subject.type === 'lab' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {subject.type}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={() => handleDeleteSubject(subject.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No subjects found. Add a subject to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      
      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-lg">
          <CheckCircle size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}


      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Course</h3>
              <button onClick={() => setShowAddCourse(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                <input required type="text" value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. CS101" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Name</label>
                <input required type="text" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. B.Tech Computer Science" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration (Years)</label>
                <input required type="number" value={courseForm.durationYears} onChange={e => setCourseForm({...courseForm, durationYears: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" rows={3}></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddCourse(false)} className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {loading ? 'Adding...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      


      
      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Subject</h3>
              <button onClick={() => setShowAddSubject(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSubject} className="p-6 space-y-4">
              {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
                <select required value={subjectForm.courseId} onChange={e => setSubjectForm({...subjectForm, courseId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                  <option value="">Select a course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Code</label>
                  <input required type="text" value={subjectForm.code} onChange={e => setSubjectForm({...subjectForm, code: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. CS101" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Credits</label>
                  <input required type="number" min="1" max="6" value={subjectForm.credits} onChange={e => setSubjectForm({...subjectForm, credits: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. 3" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
                <input required type="text" value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. Data Structures" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select required value={subjectForm.semester} onChange={e => setSubjectForm({...subjectForm, semester: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                    {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select required value={subjectForm.type} onChange={e => setSubjectForm({...subjectForm, type: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                    <option value="core">Core</option>
                    <option value="elective">Elective</option>
                    <option value="lab">Lab / Practical</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button disabled={loading} type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2">
                  {loading ? 'Saving...' : 'Save Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(() => {
        switch (activeTab) {
          case 'courses-batches':
            return renderBatchManagement();
          case 'courses-subjects':
            return renderSubjectsManagement();
          case 'courses-list':
          default:
            return renderCourseList();
        }
      })()}
    </div>
  );
}
