import { 
  Search, 
  Bell, 
  MessageSquare, 
  Calendar, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings,
  GraduationCap
} from 'lucide-react';
import { useState } from 'react';

export default function AdminTopbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors duration-300">
      
      {/* Left section: Logo & Title (visible on desktop) */}
      <div className="flex items-center gap-4 hidden md:flex">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">University ERP</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Dashboard</p>
        </div>
      </div>

      {/* Center section: Global Search */}
      <div className="flex-1 max-w-xl px-4 sm:px-12">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search students, faculty, courses, transactions..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 rounded-xl text-sm transition-all dark:text-slate-200 outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 hidden sm:flex">
            <kbd className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-sans text-slate-400">Ctrl</kbd>
            <kbd className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-sans text-slate-400">K</kbd>
          </div>
        </div>
      </div>

      {/* Right section: Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block relative">
          <Calendar size={20} />
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
          <MessageSquare size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative mr-2">
          <Bell size={20} />
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 sm:pl-4 py-1 border-l border-slate-200 dark:border-slate-800 focus:outline-none"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">Admin User</span>
              <span className="text-xs text-slate-500 font-medium">Super Admin</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <User size={18} />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden py-1 animate-fade-in-up z-50">
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <User size={16} /> My Profile
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Settings size={16} /> Settings
              </a>
              <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
              <a href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                <LogOut size={16} /> Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
