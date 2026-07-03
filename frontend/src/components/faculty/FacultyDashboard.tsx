import { useState, useEffect } from 'react';
import FacultySidebar from './FacultySidebar';
import FacultyTopbar from './FacultyTopbar';
import FacultyOverview from './FacultyOverview';
import FacultyCourses from './FacultyCourses';
import FacultyStudents from './FacultyStudents';
import FacultyAttendance from './FacultyAttendance';
import FacultyAssignments from './FacultyAssignments';
import FacultyExaminations from './FacultyExaminations';
import FacultyTimetable from './FacultyTimetable';
import FacultyMaterials from './FacultyMaterials';
import FacultyCommunication from './FacultyCommunication';
import FacultyLeave from './FacultyLeave';
import FacultyMeetings from './FacultyMeetings';
import FacultyReports from './FacultyReports';
import FacultyNotifications from './FacultyNotifications';
import FacultyProfile from './FacultyProfile';
import FacultySettings from './FacultySettings';

export default function FacultyDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);

  // Handle dark mode toggle on the body element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Temporary function to render placeholder content for unbuilt tabs
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'statistics':
        return <FacultyOverview />;
      case 'courses-assigned':
      case 'courses-materials':
      case 'courses-syllabus':
      case 'courses-plans':
        return <FacultyCourses activeTab={activeTab} />;
      case 'students-list':
      case 'students-profiles':
      case 'students-progress':
      case 'students-marks':
        return <FacultyStudents activeTab={activeTab} />;
      case 'attendance-take':
      case 'attendance-edit':
      case 'attendance-reports':
        return <FacultyAttendance activeTab={activeTab} />;
      case 'assignments-create':
      case 'assignments-review':
      case 'assignments-grade':
      case 'assignments-publish':
        return <FacultyAssignments activeTab={activeTab} />;
      case 'exams-upload':
      case 'exams-marks':
      case 'exams-internal':
      case 'exams-final':
        return <FacultyExaminations activeTab={activeTab} />;
      case 'timetable-weekly':
      case 'timetable-today':
      case 'timetable-exam':
        return <FacultyTimetable activeTab={activeTab} />;
      case 'materials-pdf':
      case 'materials-ppt':
      case 'materials-video':
      case 'materials-notes':
        return <FacultyMaterials activeTab={activeTab} />;
      case 'comm-students':
      case 'comm-admin':
      case 'comm-announcements':
      case 'comm-email':
        return <FacultyCommunication activeTab={activeTab} />;
      case 'leave-apply':
      case 'leave-history':
      case 'leave-status':
        return <FacultyLeave activeTab={activeTab} />;
      case 'meetings-schedule':
      case 'meetings-google':
      case 'meetings-zoom':
        return <FacultyMeetings activeTab={activeTab} />;
      case 'reports-performance':
      case 'reports-attendance':
      case 'reports-marks':
      case 'reports-completion':
        return <FacultyReports activeTab={activeTab} />;
      case 'notifications':
        return <FacultyNotifications />;
      case 'profile':
        return <FacultyProfile />;
      case 'settings':
        return <FacultySettings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-slate-400">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Under Construction</h2>
            <p className="text-slate-500 max-w-md">
              The <strong className="text-emerald-600">{activeTab}</strong> section is currently being built. Please check back later!
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex font-sans ${darkMode ? 'dark' : ''}`}>
      {/* Collapsible Sidebar */}
      <FacultySidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Navigation Bar */}
        <FacultyTopbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
