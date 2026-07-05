import { useState } from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  Calendar,
  Moon,
  Sun,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface TopbarProps {
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  setActiveTab: (tab: string) => void;
}

export default function FacultyTopbar({ toggleSidebar, darkMode, toggleDarkMode, setActiveTab }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
      
      {/* Left side: Hamburger (mobile) and Global Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center relative w-full max-w-md">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input 
            type="text"
            placeholder="Search students, courses, assignments..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500 text-sm outline-none transition-all"
          />
          <div className="absolute right-3 flex gap-1">
            <kbd className="hidden lg:inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-md">⌘</kbd>
            <kbd className="hidden lg:inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-md">K</kbd>
          </div>
        </div>
      </div>

      {/* Right side: Actions and Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Search Icon for Mobile */}
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 md:hidden transition-colors">
          <Search size={20} />
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 border-r border-slate-200 pr-2 sm:pr-4">
          <button 
            onClick={() => setActiveTab('timetable')}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative group"
          >
            <Calendar size={20} />
          </button>
          
          <button 
            onClick={() => setActiveTab('communication')}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative group"
          >
            <MessageSquare size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative group"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4">
              3
            </span>
          </button>

          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Faculty Profile" 
              className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm object-cover"
            />
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-slate-700 leading-tight">Dr. Alan Turing</p>
              <p className="text-xs text-slate-500">Computer Science</p>
            </div>
            <ChevronDown size={16} className="hidden lg:block text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden animate-fade-in-up">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">Dr. Alan Turing</p>
                  <p className="text-xs text-slate-500 truncate">alan.turing@edubot.edu</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                    <User size={16} /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                    <Settings size={16} /> Settings
                  </button>
                </div>
                <div className="py-2 border-t border-slate-100">
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
