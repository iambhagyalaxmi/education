import { useState, useEffect } from 'react';
import { Search, Plus, FileText, CheckCircle, Edit, Calendar, Trash2, X } from 'lucide-react';

export default function AdminExaminations({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', course: '', date: '', time: '', room: '', status: 'Upcoming'
  });
  const [loading, setLoading] = useState(false);

  // Grading Scales State
  const [scales, setScales] = useState<any[]>([]);
  const [gradeModal, setGradeModal] = useState(false);
  const [gradeEditingId, setGradeEditingId] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({ grade: '', minScore: '', maxScore: '', gpa: '' });

  const fetchScales = () => fetch('/api/grading').then(res => res.json()).then(data => setScales(Array.isArray(data) ? data : [])).catch(console.error);

  useEffect(() => {
    fetch('/api/grading').then(res => res.json()).then(data => setScales(Array.isArray(data) ? data : [])).catch(console.error);
  }, []);

  const fetchExams = () => {
    fetch('/api/examinations').then(res => res.json()).then(data => setExams(Array.isArray(data) ? data : [])).catch(console.error);
  };

  useEffect(() => {
    fetchExams();
  }, [activeTab]);

  const deleteExam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    await fetch(`/api/examinations?id=${id}`, { method: 'DELETE' });
    fetchExams();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `/api/examinations?id=${editingId}` : '/api/examinations';
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert("Error saving exam: " + (data.error || 'Server error.'));
        return;
      }
      
      setShowModal(false);
      fetchExams();
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ name: '', course: '', date: '', time: '', room: '', status: 'Upcoming' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (exam: any) => {
    setForm({ name: exam.name, course: exam.course, date: exam.date, time: exam.time, room: exam.room, status: exam.status });
    setEditingId(exam.id);
    setShowModal(true);
  };

  const renderSchedule = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Examination Schedule</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage exam timetables across all departments.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Calendar size={18} /> Schedule Exam
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by exam name or course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p>No exams scheduled yet. Click "Schedule Exam" to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Exam Name</th>
                  <th className="p-4">Course / Program</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {exams.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.course.toLowerCase().includes(searchTerm.toLowerCase())).map((exam, i) => (
                  <tr key={exam.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <FileText size={20} />
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{exam.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{exam.course}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{exam.date} • {exam.time}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{exam.room}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        exam.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(exam)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteExam(exam.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Exam' : 'Schedule New Exam'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam Name</label>
                  <input type="text" required placeholder="e.g. Mid-Term Mathematics" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course / Program</label>
                  <input type="text" required placeholder="e.g. B.Tech CS" value={form.course} onChange={e => setForm({...form, course: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input type="text" required placeholder="e.g. Oct 15, 2024" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time (Duration)</label>
                    <input type="text" required placeholder="e.g. 09:00 AM (2h)" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
                    <input type="text" required placeholder="e.g. Exam Hall A" value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md">{loading ? 'Saving...' : 'Save Exam'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Exam Results Publication</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review and publish finalized student results.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <CheckCircle size={18} /> Publish Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { exam: 'Spring 2024 Finals', program: 'B.Tech CS', total: 120, passed: 115, status: 'Draft' },
          { exam: 'Mid-Term 2024', program: 'BBA', total: 60, passed: 58, status: 'Published' },
          { exam: 'Practical Boards', program: 'B.Tech IT', total: 85, passed: 85, status: 'Published' },
        ].map((res, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                res.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' : 
                'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800'
              }`}>
                {res.status}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{res.exam}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{res.program}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pass Rate</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{Math.round((res.passed/res.total)*100)}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Appeared</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{res.total}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrading = () => {

    const handleSaveGrade = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const url = gradeEditingId ? `/api/grading?id=${gradeEditingId}` : '/api/grading';
        const method = gradeEditingId ? 'PUT' : 'POST';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gradeForm) });
        
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          alert("Error saving grading scale: " + (data.error || 'Server error.'));
          return;
        }

        setGradeModal(false);
        fetchScales();
      } catch (err) {
        console.error(err);
        alert("Error connecting to server. Is it running?");
      }
    };

    const deleteScale = async (id: string) => {
      if (!confirm("Delete this grading scale?")) return;
      await fetch(`/api/grading?id=${id}`, { method: 'DELETE' });
      fetchScales();
    };

    return (
      <div className="space-y-6 animate-fade-in-up pb-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Grade Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure grading scales and GPA calculations.</p>
          </div>
          <button onClick={() => { setGradeForm({ grade: '', minScore: '', maxScore: '', gpa: '' }); setGradeEditingId(null); setGradeModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={18} /> Add Grade Scale
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {scales.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p>No grading scales defined. Click "Add Grade Scale" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 pl-6">Grade</th>
                    <th className="p-4">Score Range</th>
                    <th className="p-4">GPA Value</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scales.map((scale, i) => (
                    <tr key={scale.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">{scale.grade}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{scale.minScore}% - {scale.maxScore}%</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{scale.gpa}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setGradeForm({ grade: scale.grade, minScore: scale.minScore, maxScore: scale.maxScore, gpa: scale.gpa }); setGradeEditingId(scale.id); setGradeModal(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => deleteScale(scale.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {gradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {gradeEditingId ? 'Edit Scale' : 'Add Scale'}
                </h3>
                <button onClick={() => setGradeModal(false)} className="text-slate-400 hover:text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSaveGrade} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade (e.g. A+)</label>
                    <input type="text" required value={gradeForm.grade} onChange={e => setGradeForm({...gradeForm, grade: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Score</label>
                      <input type="number" required value={gradeForm.minScore} onChange={e => setGradeForm({...gradeForm, minScore: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Score</label>
                      <input type="number" required value={gradeForm.maxScore} onChange={e => setGradeForm({...gradeForm, maxScore: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GPA Value (e.g. 4.0)</label>
                    <input type="number" step="0.1" required value={gradeForm.gpa} onChange={e => setGradeForm({...gradeForm, gpa: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setGradeModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  switch (activeTab) {
    case 'exams-schedule': return renderSchedule();
    case 'exams-results': return renderResults();
    case 'exams-grading': return renderGrading();
    default: return renderSchedule();
  }
}
