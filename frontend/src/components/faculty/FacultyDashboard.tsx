import { useState, useEffect } from 'react';
import FacultySidebar from './FacultySidebar';
import FacultyTopbar from './FacultyTopbar';
import FacultyOverview from './FacultyOverview';

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
        return <FacultyOverview />;
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
