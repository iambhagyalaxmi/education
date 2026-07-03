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
  GraduationCap,
  Clock
} from 'lucide-react';
import { useState } from 'react';

export default function AdminTopbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const closeAll = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);
    setShowMessages(false);
    setShowCalendar(false);
  };

  const toggleMenu = (menu: 'profile' | 'notifications' | 'messages' | 'calendar') => {
    const isCurrentlyOpen = 
      (menu === 'profile' && showProfileMenu) ||
      (menu === 'notifications' && showNotifications) ||
      (menu === 'messages' && showMessages) ||
      (menu === 'calendar' && showCalendar);
    
    closeAll();
    
    if (!isCurrentlyOpen) {
      if (menu === 'profile') setShowProfileMenu(true);
      if (menu === 'notifications') setShowNotifications(true);
      if (menu === 'messages') setShowMessages(true);
      if (menu === 'calendar') setShowCalendar(true);
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
        
        {/* Calendar */}
        <div className="relative hidden sm:block">
          <button onClick={() => toggleMenu('calendar')} className={`p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative ${showCalendar ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
            <Calendar size={20} />
          </button>
          {showCalendar && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in-up z-50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white">Upcoming Events</h3>
                <span className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded font-bold">2 Today</span>
              </div>
              <div className="p-2 space-y-1">
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors border-l-2 border-indigo-500">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Board Meeting</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12} /> 10:00 AM - Conf. Room A</p>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors border-l-2 border-emerald-500">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Faculty Orientation</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12} /> 02:00 PM - Main Hall</p>
                </div>
              </div>
              <a href="#" className="block p-3 text-center text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-t border-slate-100 dark:border-slate-700">View Full Calendar</a>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <button onClick={() => toggleMenu('messages')} className={`p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative ${showMessages ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
            <MessageSquare size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in-up z-50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white">Messages</h3>
                <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded font-bold">1 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors flex gap-3 border-b border-slate-50 dark:border-slate-700/50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold shrink-0">JD</div>
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">John Doe (HOD)</p>
                      <span className="text-xs text-blue-600 font-semibold">10m</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-medium text-slate-800 dark:text-slate-200">The syllabus update for next semester has been finalized.</p>
                  </div>
                </div>
                <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors flex gap-3 opacity-70">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0">AS</div>
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin Support</p>
                      <span className="text-xs text-slate-500">2h</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">Server maintenance scheduled for tonight.</p>
                  </div>
                </div>
              </div>
              <a href="#" className="block p-3 text-center text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-t border-slate-100 dark:border-slate-700">Open Inbox</a>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative mr-2">
          <button onClick={() => toggleMenu('notifications')} className={`p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative ${showNotifications ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
            <Bell size={20} />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in-up z-50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Database Backup Failed</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Automated backup failed due to insufficient storage space.</p>
                  <span className="text-xs text-red-500 font-medium mt-2 block">10 mins ago</span>
                </div>
                <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-l-4 border-emerald-500">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Fee Collection Target Met</p>
                  <p className="text-xs text-slate-500 mt-1">Monthly fee collection has reached 100% of the target.</p>
                  <span className="text-xs text-slate-400 mt-2 block">1 hour ago</span>
                </div>
                <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">5 New Admissions</p>
                  <p className="text-xs text-slate-500 mt-1">Pending review in the admissions module.</p>
                  <span className="text-xs text-slate-400 mt-2 block">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('profile')}
            className={`flex items-center gap-3 pl-2 sm:pl-4 py-1 border-l border-slate-200 dark:border-slate-800 focus:outline-none transition-opacity ${showProfileMenu ? 'opacity-70' : 'hover:opacity-80'}`}
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
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 md:hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
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
