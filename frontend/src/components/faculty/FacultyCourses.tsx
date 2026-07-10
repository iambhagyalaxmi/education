import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileText, 
  Video, 
  Download, 
  MoreVertical,
  FolderOpen,
  X,
  CheckCircle,
  File,
  Upload,
  Trash2,
  Edit3
} from 'lucide-react';

interface FacultyCoursesProps {
  activeTab: string;
}

export default function FacultyCourses({ activeTab }: FacultyCoursesProps) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', fileType: 'PDF', fileSize: '2048' });
  const [plans, setPlans] = useState<any[]>([]);
  const [planForm, setPlanForm] = useState({ id: '', topic: '', date: '', duration: '', objectives: '', tool: '', status: 'Pending' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/lesson-plans');
      if (res.ok) setPlans(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (activeTab === 'courses-materials') {
      fetchMaterials();
    }
    if (activeTab === 'courses-plans') {
      fetchPlans();
    }
  }, [activeTab]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm)
      });
      if (!res.ok) throw new Error('Failed to upload material');
      setSuccess('Material uploaded successfully!');
      setUploadForm({ title: '', description: '', fileType: 'PDF', fileSize: '2048' });
      setSelectedFileName('');
      setShowUploadModal(false);
      fetchMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      const res = await fetch(`/api/materials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMaterials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEditing = !!planForm.id;
      const url = isEditing ? `/api/lesson-plans?id=${planForm.id}` : '/api/lesson-plans';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm)
      });
      
      if (res.ok) {
        setSuccess(`Lesson plan ${isEditing ? 'updated' : 'created'} successfully!`);
        setTimeout(() => setSuccess(''), 3000);
        setShowCreatePlanModal(false);
        setPlanForm({ id: '', topic: '', date: '', duration: '', objectives: '', tool: '', status: 'Pending' });
        fetchPlans();
      } else {
        setError(`Failed to ${isEditing ? 'update' : 'create'} lesson plan`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditPlan = (plan: any) => {
    setPlanForm({
      id: plan.id,
      topic: plan.topic,
      date: new Date(plan.date).toISOString().split('T')[0],
      duration: plan.duration.toString(),
      objectives: plan.objectives,
      tool: plan.tool,
      status: plan.status
    });
    setShowCreatePlanModal(true);
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson plan?')) return;
    try {
      const res = await fetch(`/api/lesson-plans?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const renderAssignedCourses = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Assigned Courses</h2>
        <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
          + Request New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'CS401', title: 'Data Structures & Algorithms', sem: 'Semester 4', students: 120, progress: 65, color: 'emerald' },
          { id: 'CS402', title: 'Operating Systems', sem: 'Semester 4', students: 118, progress: 40, color: 'blue' },
          { id: 'CS601', title: 'Computer Networks', sem: 'Semester 6', students: 85, progress: 80, color: 'purple' },
          { id: 'CS605', title: 'Artificial Intelligence', sem: 'Semester 6', students: 92, progress: 20, color: 'rose' }
        ].map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
            <div className={`h-2 w-full bg-${course.color}-500`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-${course.color}-50 text-${course.color}-700 border border-${course.color}-100`}>
                  {course.id}
                </span>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6">{course.sem}</p>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users size={16} className="text-slate-400" />
                  {course.students} Students
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock size={16} className="text-slate-400" />
                  3 Hrs/Week
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500">Syllabus Completion</span>
                  <span className="text-slate-800">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`bg-${course.color}-500 h-2 rounded-full transition-all duration-1000`} style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View Details</button>
              <button className="text-sm font-semibold text-slate-600 hover:text-slate-800">Edit Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourseMaterials = () => (
    <div className="space-y-6 animate-fade-in-up">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-lg">
          <CheckCircle size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Course Materials</h2>
        <button onClick={() => setShowUploadModal(true)} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
          <Upload size={18} /> Upload Material
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FolderOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">CS401: Data Structures</h3>
            <p className="text-sm text-slate-500">{materials.length} files available</p>
          </div>
        </div>

        <div className="space-y-3">
          {materials.map((file, i) => (
            <div key={file.id || i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${file.fileType === 'PDF' ? 'bg-red-50 text-red-500' : 
                    file.fileType === 'PPT' ? 'bg-orange-50 text-orange-500' : 
                    'bg-purple-50 text-purple-500'}`
                }>
                  {file.fileType === 'VIDEO' ? <Video size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">{file.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{Math.round(file.fileSize / 1024)} MB • Uploaded {new Date(file.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <a href={file.fileUrl || '#'} download className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Download size={18} />
                </a>
                <button onClick={() => handleDeleteMaterial(file.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No materials found. Upload a material to get started.
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Upload Material</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">File</label>
                <label className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-emerald-300 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFileName(file.name);
                        const kbSize = Math.round(file.size / 1024).toString();
                        let type = 'PDF';
                        if (file.type.includes('presentation') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) type = 'PPT';
                        if (file.type.includes('video')) type = 'VIDEO';
                        
                        setUploadForm({
                          ...uploadForm,
                          title: uploadForm.title || file.name.split('.')[0],
                          fileSize: kbSize,
                          fileType: type
                        });
                      }
                    }}
                  />
                  <File size={32} className={`mb-2 ${selectedFileName ? 'text-blue-500' : 'text-emerald-500'}`} />
                  <p className="text-sm font-medium text-center">
                    {selectedFileName ? (
                      <span className="text-slate-800 font-bold">{selectedFileName}</span>
                    ) : (
                      'Click to select or drag and drop'
                    )}
                  </p>
                  {!selectedFileName && <p className="text-xs mt-1">PDF, PPTX, or MP4 (Max 50MB)</p>}
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input required type="text" value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Unit 1: Introduction" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">File Type</label>
                  <select value={uploadForm.fileType} onChange={e => setUploadForm({...uploadForm, fileType: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="PDF">PDF</option>
                    <option value="PPT">PowerPoint</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Size (KB)</label>
                  <input required type="number" value={uploadForm.fileSize} onChange={e => setUploadForm({...uploadForm, fileSize: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {loading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSyllabus = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Course Syllabus</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>CS401: Data Structures</option>
            <option>CS402: Operating Systems</option>
          </select>
          <button onClick={() => {
            const blob = new Blob(["This is a mockup course syllabus PDF for Faculty."], { type: 'application/pdf' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Course_Syllabus.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">CS401: Data Structures & Algorithms</h3>
          <p className="text-sm text-slate-500 mt-1">Semester 4 • 4 Credits • Total Hours: 60</p>
        </div>
        
        <div className="divide-y divide-slate-100">
          {[
            { 
              unit: 'Unit 1: Introduction & Basic Structures', 
              hours: '12 Hours', 
              topics: ['Algorithm Analysis (Time & Space Complexity)', 'Arrays, Strings, and Pointers', 'Linked Lists (Singly, Doubly, Circular)', 'Stacks and Queues implementations']
            },
            { 
              unit: 'Unit 2: Trees', 
              hours: '14 Hours', 
              topics: ['Binary Trees and properties', 'Binary Search Trees (BST)', 'AVL Trees and rotations', 'Red-Black Trees overview', 'B-Trees']
            },
            { 
              unit: 'Unit 3: Graphs', 
              hours: '14 Hours', 
              topics: ['Graph terminology and representation', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Shortest Path Algorithms (Dijkstra, Bellman-Ford)', 'Minimum Spanning Trees (Kruskal, Prim)']
            },
            { 
              unit: 'Unit 4: Sorting & Searching', 
              hours: '10 Hours', 
              topics: ['Linear and Binary Search', 'Bubble, Selection, and Insertion Sort', 'Merge Sort and Quick Sort', 'Heap Sort', 'Hashing techniques and collision resolution']
            },
            { 
              unit: 'Unit 5: Advanced Topics', 
              hours: '10 Hours', 
              topics: ['Dynamic Programming basics', 'Greedy Algorithms', 'Backtracking', 'Trie Data Structure']
            }
          ].map((unit, i) => (
            <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-emerald-700">{unit.unit}</h4>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {unit.hours}
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {unit.topics.map((topic, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLessonPlans = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Lesson Plans</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option>CS401: Data Structures</option>
            <option>CS402: Operating Systems</option>
          </select>
          <button onClick={() => {
            setPlanForm({ id: '', topic: '', date: '', duration: '', objectives: '', tool: '', status: 'Pending' });
            setShowCreatePlanModal(true);
          }} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
            + Create Plan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">CS401: Data Structures</h3>
            <p className="text-sm text-slate-500 mt-1">Week 4: October 18 - October 24</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">Previous Week</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">Next Week</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Day/Date</th>
                <th className="px-6 py-4">Topic</th>
                <th className="px-6 py-4">Pedagogical Tool</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {plans.length > 0 ? plans.map((lesson) => {
                const isCompleted = lesson.status === 'Completed';
                const isInProgress = lesson.status === 'In Progress';
                const color = isCompleted ? 'emerald' : isInProgress ? 'blue' : 'slate';
                
                return (
                  <tr key={lesson.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-900">{new Date(lesson.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{lesson.topic}</td>
                    <td className="px-6 py-4 text-slate-500">{lesson.tool}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
                        {lesson.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEditPlan(lesson)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDeletePlan(lesson.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No lesson plans found. Click "+ Create Plan" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{planForm.id ? 'Edit Lesson Plan' : 'Create Lesson Plan'}</h3>
              <button onClick={() => setShowCreatePlanModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Topic / Title</label>
                <input type="text" value={planForm.topic} onChange={e => setPlanForm({...planForm, topic: e.target.value})} placeholder="e.g. Introduction to Trees" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                  <input type="date" value={planForm.date} onChange={e => setPlanForm({...planForm, date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (mins)</label>
                  <input type="number" value={planForm.duration} onChange={e => setPlanForm({...planForm, duration: e.target.value})} placeholder="60" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pedagogical Tool</label>
                  <input type="text" value={planForm.tool} onChange={e => setPlanForm({...planForm, tool: e.target.value})} placeholder="e.g. Chalk & Board" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select value={planForm.status} onChange={e => setPlanForm({...planForm, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Objectives</label>
                <textarea rows={3} value={planForm.objectives} onChange={e => setPlanForm({...planForm, objectives: e.target.value})} placeholder="What will students learn?" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreatePlanModal(false)} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <BookOpen className="text-slate-400 w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md">
        This section is ready for content. Connect to your database to populate the {title.toLowerCase()}.
      </p>
    </div>
  );

  switch (activeTab) {
    case 'courses-assigned':
      return renderAssignedCourses();
    case 'courses-materials':
      return renderCourseMaterials();
    case 'courses-syllabus':
      return renderSyllabus();
    case 'courses-plans':
      return renderLessonPlans();
    default:
      return renderPlaceholder('Course Information');
  }
}
