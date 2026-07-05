import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award,
  Edit
} from 'lucide-react';

export default function FacultyProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-10">
      
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-6 -mt-12">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-1.5 shadow-md">
                <div className="w-full h-full bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                  <User size={64} className="text-slate-300" />
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dr. Sarah Jenkins</h1>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  Associate Professor <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Computer Science
                </p>
              </div>
            </div>
            <div className="pb-2">
              <button 
                onClick={() => alert("Profile editing mode activated. (This will open a settings modal in the future)")}
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Edit size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Contact & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><User size={18}/> About Me</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Passionate educator and researcher with over 10 years of experience in Artificial Intelligence and Data Structures. Dedicated to fostering a collaborative learning environment.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Mail size={16}/></div>
                <span className="truncate">s.jenkins@university.edu</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Phone size={16}/></div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><MapPin size={16}/></div>
                <span>Room 402, Block B</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Briefcase size={16}/></div>
                <span>Employee ID: FAC-8902</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Qualifications & Experience */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><GraduationCap size={18}/> Academic Qualifications</h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_0_4px_white]"></div>
                <h4 className="font-bold text-slate-800">Ph.D. in Computer Science</h4>
                <p className="text-sm font-medium text-emerald-600 mt-0.5">Stanford University • 2012 - 2016</p>
                <p className="text-sm text-slate-500 mt-2">Thesis: "Optimization Algorithms in Distributed Machine Learning Systems"</p>
              </div>
              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-slate-300 shadow-[0_0_0_4px_white]"></div>
                <h4 className="font-bold text-slate-800">M.S. in Software Engineering</h4>
                <p className="text-sm font-medium text-slate-500 mt-0.5">MIT • 2010 - 2012</p>
              </div>
              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-slate-300 shadow-[0_0_0_4px_white]"></div>
                <h4 className="font-bold text-slate-800">B.S. in Computer Science</h4>
                <p className="text-sm font-medium text-slate-500 mt-0.5">UC Berkeley • 2006 - 2010</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Award size={18}/> Research & Publications</h3>
            
            <div className="space-y-4">
              {[
                { title: "Efficient Data Structures for Graph Neural Networks", journal: "IEEE Transactions on Neural Networks", year: "2022" },
                { title: "A Survey of Modern Web Architecture Patterns", journal: "ACM Computing Surveys", year: "2020" },
                { title: "Scalable Microservices in Educational Technology", journal: "International Journal of EdTech", year: "2019" }
              ].map((pub, i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{pub.title}</h4>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="text-emerald-600">{pub.journal}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{pub.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
