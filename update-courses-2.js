const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/admin/AdminCourses.tsx', 'utf8');

// 1. State
content = content.replace(
  "const [batchForm, setBatchForm] = useState({ courseId: '', academicYear: '', startYear: '', endYear: '' });",
  "const [batchForm, setBatchForm] = useState({ courseId: '', academicYear: '', startYear: '', endYear: '' });\n  const [subjectForm, setSubjectForm] = useState({ courseId: '', code: '', name: '', semester: '1', credits: '3', type: 'core' });\n  const [subjects, setSubjects] = useState<any[]>([]);\n  const [showAddSubject, setShowAddSubject] = useState(false);"
);

// 2. Fetch and Handlers
const fetchAndHandlers = `
  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async (e: any) => {
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
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      const res = await fetch(\`/api/subjects?id=\${id}\`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete subject');
      setSuccess('Subject deleted successfully!');
      fetchSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  };
`;

content = content.replace(
  "  const renderCourseList = () => (",
  fetchAndHandlers + "\n  const renderCourseList = () => ("
);

// 3. useEffect
content = content.replace(
  "  useEffect(() => {\n    fetchCourses();\n  }, [activeTab]);",
  "  useEffect(() => {\n    fetchCourses();\n    fetchSubjects();\n  }, [activeTab]);"
);

// 4. renderSubjectsManagement
const renderSubjects = `
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
                    <span className={\`px-2 py-1 text-xs font-bold rounded-md uppercase \${
                      subject.type === 'core' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      subject.type === 'lab' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }\`}>
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
`;

content = content.replace(
  "  switch (activeTab) {",
  renderSubjects + "\n  switch (activeTab) {"
);

// 5. Add Modal (Inside the main return, just before the switch)
const modalContent = `
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
                    {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>Semester {s}</option>)}
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
`;

content = content.replace(
  "      {(() => {\\n        switch (activeTab) {",
  modalContent + "\n      {(() => {\n        switch (activeTab) {"
);

content = content.replace(
  "          case 'courses-batches':\n            return renderBatchManagement();",
  "          case 'courses-batches':\n            return renderBatchManagement();\n          case 'courses-subjects':\n            return renderSubjectsManagement();"
);

fs.writeFileSync('frontend/src/components/admin/AdminCourses.tsx', content);
