import {
  BookOpen,
  Users,
  CalendarDays,
  FileEdit,
  HelpCircle,
  Megaphone,
  CheckSquare,
  Upload,
  BarChart,
  MessageSquare,
  Clock,
  MoreVertical,
  CheckCircle2,
  Download,
  Printer
} from 'lucide-react';

export default function FacultyOverview() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in-up">
      
      {/* 1. Dashboard Overview (Summary Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Card 1: Courses Assigned */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Courses Assigned</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-800">4</h3>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">3 Active</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Students</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-800">248</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">+12 New</span>
            </div>
          </div>
        </div>

        {/* Card 3: Today's Classes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <CalendarDays size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Today's Classes</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-800">3</h3>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Next: 10:30 AM</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Assignments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
            <FileEdit size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Assignments</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-800">42</h3>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Needs Review</span>
            </div>
          </div>
        </div>

        {/* Card 5: Student Queries */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">
            <HelpCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Student Queries</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-800">8</h3>
              <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">Unread</span>
            </div>
          </div>
        </div>

        {/* Card 6: Institute Announcements */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <Megaphone size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Institute Announcements</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold text-slate-800 truncate max-w-[150px]">Exam Schedule</h3>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Latest</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-500 hover:shadow-md transition-all group">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <CheckSquare size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center">Take Attendance</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <FileEdit size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center">Create Assignment</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-purple-500 hover:shadow-md transition-all group">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Upload size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center">Upload Notes</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-orange-500 hover:shadow-md transition-all group">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <BarChart size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center">Enter Marks</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all group">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Megaphone size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center">Post Notice</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-rose-500 hover:shadow-md transition-all group">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <MessageSquare size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center">Reply Queries</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Today's Timetable */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Today's Timetable</h2>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors"><Printer size={18} /></button>
              <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors"><Download size={18} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-900">09:00 AM</td>
                  <td className="px-6 py-4">Data Structures</td>
                  <td className="px-6 py-4">Lab 3</td>
                  <td className="px-6 py-4">Sem 4 - B2</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 size={14} /> Completed</span></td>
                  <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-emerald-600 transition-colors"><MoreVertical size={18} /></button></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group border-l-4 border-l-purple-500">
                  <td className="px-6 py-4 font-semibold text-slate-900">10:30 AM</td>
                  <td className="px-6 py-4">Operating Systems</td>
                  <td className="px-6 py-4">Room 402</td>
                  <td className="px-6 py-4">Sem 4 - B1</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700"><Clock size={14} /> Ongoing</span></td>
                  <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-emerald-600 transition-colors"><MoreVertical size={18} /></button></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-900">01:00 PM</td>
                  <td className="px-6 py-4">Computer Networks</td>
                  <td className="px-6 py-4">Room 405</td>
                  <td className="px-6 py-4">Sem 6 - A</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"><Clock size={14} /> Upcoming</span></td>
                  <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-emerald-600 transition-colors"><MoreVertical size={18} /></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Student Attendance Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Attendance Summary</h2>
          <div className="flex items-center justify-center mb-8 relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="351.8" strokeDashoffset="52.7" className="transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">85%</span>
              <span className="text-xs text-slate-500 font-medium">Overall</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
                <span className="font-bold text-slate-800">85%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full w-[85%]" /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Absent</span>
                <span className="font-bold text-slate-800">12%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-rose-500 rounded-full w-[12%]" /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Leave</span>
                <span className="font-bold text-slate-800">3%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full w-[3%]" /></div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 5. Recent Assignments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Assignments</h2>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Assignment Name</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-900">React Fundamentals</td>
                  <td className="px-6 py-4">Web Dev - Sem 4</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">42 to Grade</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden w-24"><div className="h-full bg-emerald-500 rounded-full w-[80%]" /></div>
                      <span className="text-xs font-medium text-slate-500">48/60</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-900">Process Scheduling</td>
                  <td className="px-6 py-4">OS - Sem 4</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">All Graded</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden w-24"><div className="h-full bg-emerald-500 rounded-full w-[100%]" /></div>
                      <span className="text-xs font-medium text-slate-500">60/60</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-900">Binary Search Trees</td>
                  <td className="px-6 py-4">Data Structures</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Ongoing</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden w-24"><div className="h-full bg-emerald-500 rounded-full w-[30%]" /></div>
                      <span className="text-xs font-medium text-slate-500">18/60</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Recent Student Queries */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Student Queries</h2>
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">3 New</span>
          </div>
          <div className="p-2 space-y-2">
            {[
              { name: 'Alice Smith', course: 'Web Dev', time: '10m ago', question: 'I am getting a CORS error when trying to fetch from the local API server.' },
              { name: 'Bob Johnson', course: 'Data Structures', time: '1h ago', question: 'Could you explain the difference between AVL and Red-Black trees again?' },
              { name: 'Charlie Davis', course: 'Operating Systems', time: '3h ago', question: 'Is the assignment deadline strictly Friday night?' }
            ].map((query, i) => (
              <div key={i} className="p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  {query.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{query.name}</h4>
                      <p className="text-xs text-slate-500">{query.course}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{query.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mt-1">{query.question}</p>
                  <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-2 flex items-center gap-1">
                    Reply to query <MessageSquare size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 7. Announcements */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Announcements</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Megaphone size={20} />
              </div>
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <h4 className="font-semibold text-slate-800">Mid-term Examinations</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-red-100 text-red-700 uppercase">High</span>
                </div>
                <p className="text-sm text-slate-500 mb-2">Mid-term examinations will commence from the 15th of next month. Please submit question papers.</p>
                <span className="text-xs text-slate-400 font-medium">Oct 12, 2026</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Megaphone size={20} />
              </div>
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <h4 className="font-semibold text-slate-800">Faculty Meeting</h4>
                </div>
                <p className="text-sm text-slate-500 mb-2">Mandatory faculty meeting in the main auditorium this Friday at 4 PM.</p>
                <span className="text-xs text-slate-400 font-medium">Oct 10, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Events</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-rose-500 uppercase">Oct</span>
                <span className="text-xl font-extrabold text-slate-800 leading-none mt-0.5">15</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Tech Symposium 2026</h4>
                <p className="text-sm text-slate-500">Main Auditorium • 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-blue-500 uppercase">Oct</span>
                <span className="text-xl font-extrabold text-slate-800 leading-none mt-0.5">22</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Guest Lecture: AI in Education</h4>
                <p className="text-sm text-slate-500">Seminar Hall 2 • 02:00 PM</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
