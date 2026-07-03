import { 
  BookOpen, 
  Users, 
  Clock, 
  FileText, 
  Video, 
  Download, 
  MoreVertical,
  FolderOpen
} from 'lucide-react';

interface FacultyCoursesProps {
  activeTab: string;
}

export default function FacultyCourses({ activeTab }: FacultyCoursesProps) {

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Course Materials</h2>
        <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
          <Download size={18} /> Upload Material
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FolderOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">CS401: Data Structures</h3>
            <p className="text-sm text-slate-500">24 files • Last updated 2 days ago</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Unit 1: Trees and Graphs.pdf', type: 'pdf', size: '2.4 MB', date: 'Oct 12' },
            { name: 'Lecture 4 - Red Black Trees.pptx', type: 'ppt', size: '5.1 MB', date: 'Oct 10' },
            { name: 'Sorting Algorithms Visualization.mp4', type: 'video', size: '42 MB', date: 'Oct 05' },
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${file.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                    file.type === 'ppt' ? 'bg-orange-50 text-orange-500' : 
                    'bg-purple-50 text-purple-500'}`
                }>
                  {file.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">{file.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{file.size} • Uploaded {file.date}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
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
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
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
      return renderPlaceholder('Lesson Plans');
    default:
      return renderPlaceholder('Course Information');
  }
}
