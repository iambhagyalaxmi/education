import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import TicketDashboard from './components/TicketDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AuthLogin from './components/AuthLogin';
import AuditDashboard from './components/AuditDashboard';
import LandingPage from './components/LandingPage';
import DocumentDashboard from './components/DocumentDashboard';
import GalleryDashboard from './components/GalleryDashboard';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import { Moon, Sun, ArrowLeft } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/:role/login" element={
          <div className={darkMode ? 'dark' : ''}>
            <div className="dark:bg-slate-900 min-h-screen transition-colors duration-300 relative">
              <div className="absolute top-4 left-4 z-10">
                <button 
                  onClick={() => navigate('/')} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-md hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={18} /> Back to Site
                </button>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <AuthLogin onLogin={(role) => navigate(role === 'faculty' ? '/faculty/dashboard' : '/dashboard')} />
            </div>
          </div>
        } />

        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

        <Route path="/dashboard" element={
          <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col items-center py-10 relative">
            <div className="w-full max-w-5xl px-4">
              <header className="mb-10 flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">Education Portal</h1>
                  <p className="mt-2 text-lg text-gray-600 dark:text-slate-400">Manage your student support seamlessly.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </header>

              <main className="space-y-8">
                <AnalyticsDashboard />
                <TicketDashboard />
                <DocumentDashboard />
                <GalleryDashboard />
                <AuditDashboard />
              </main>
            </div>
          </div>
        } />
      </Routes>
      <ChatWidget />
    </>
  );
}
