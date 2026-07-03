import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CheckSquare,
  FileEdit,
  FileText,
  CalendarDays,
  Library,
  MessageSquare,
  PlaneTakeoff,
  Video,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  id?: string;
  children?: { title: string; id: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { title: 'Overview', id: 'overview' },
      { title: 'Quick Statistics', id: 'statistics' },
    ]
  },
  {
    title: 'My Courses',
    icon: BookOpen,
    children: [
      { title: 'Assigned Courses', id: 'courses-assigned' },
      { title: 'Course Materials', id: 'courses-materials' },
      { title: 'Syllabus', id: 'courses-syllabus' },
      { title: 'Lesson Plans', id: 'courses-plans' },
    ]
  },
  {
    title: 'Student Management',
    icon: Users,
    children: [
      { title: 'Student List', id: 'students-list' },
      { title: 'Student Profiles', id: 'students-profiles' },
      { title: 'Academic Progress', id: 'students-progress' },
      { title: 'Internal Marks', id: 'students-marks' },
    ]
  },
  {
    title: 'Attendance',
    icon: CheckSquare,
    children: [
      { title: 'Take Attendance', id: 'attendance-take' },
      { title: 'Edit Attendance', id: 'attendance-edit' },
      { title: 'Attendance Reports', id: 'attendance-reports' },
    ]
  },
  {
    title: 'Assignments',
    icon: FileEdit,
    children: [
      { title: 'Create Assignment', id: 'assignments-create' },
      { title: 'Review Submissions', id: 'assignments-review' },
      { title: 'Grade Assignments', id: 'assignments-grade' },
      { title: 'Publish Results', id: 'assignments-publish' },
    ]
  },
  {
    title: 'Examinations',
    icon: FileText,
    children: [
      { title: 'Upload Question Papers', id: 'exams-upload' },
      { title: 'Enter Marks', id: 'exams-marks' },
      { title: 'Internal Assessment', id: 'exams-internal' },
      { title: 'Final Assessment', id: 'exams-final' },
    ]
  },
  {
    title: 'Timetable',
    icon: CalendarDays,
    children: [
      { title: 'Weekly Schedule', id: 'timetable-weekly' },
      { title: 'Today\'s Classes', id: 'timetable-today' },
      { title: 'Exam Schedule', id: 'timetable-exam' },
    ]
  },
  {
    title: 'Study Materials',
    icon: Library,
    children: [
      { title: 'Upload PDFs', id: 'materials-pdf' },
      { title: 'Upload PPT', id: 'materials-ppt' },
      { title: 'Upload Videos', id: 'materials-video' },
      { title: 'Share Notes', id: 'materials-notes' },
    ]
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    children: [
      { title: 'Chat with Students', id: 'comm-students' },
      { title: 'Chat with Admin', id: 'comm-admin' },
      { title: 'Send Announcements', id: 'comm-announcements' },
      { title: 'Email Notifications', id: 'comm-email' },
    ]
  },
  {
    title: 'Leave Management',
    icon: PlaneTakeoff,
    children: [
      { title: 'Apply Leave', id: 'leave-apply' },
      { title: 'Leave History', id: 'leave-history' },
      { title: 'Leave Status', id: 'leave-status' },
    ]
  },
  {
    title: 'Meetings',
    icon: Video,
    children: [
      { title: 'Schedule Online Class', id: 'meetings-schedule' },
      { title: 'Google Meet', id: 'meetings-google' },
      { title: 'Zoom Meeting Links', id: 'meetings-zoom' },
    ]
  },
  {
    title: 'Reports',
    icon: BarChart3,
    children: [
      { title: 'Student Performance', id: 'reports-performance' },
      { title: 'Attendance Reports', id: 'reports-attendance' },
      { title: 'Marks Reports', id: 'reports-marks' },
      { title: 'Course Completion', id: 'reports-completion' },
    ]
  },
  { title: 'Notifications', icon: Bell, id: 'notifications' },
  { title: 'Profile', icon: User, id: 'profile' },
  { title: 'Settings', icon: Settings, id: 'settings' },
];

export default function FacultySidebar({ isOpen, setIsOpen, activeTab, setActiveTab }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'Dashboard': true
  });

  const toggleExpand = (title: string) => {
    if (!isOpen) setIsOpen(true);
    setExpandedItems(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
          isOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200 shrink-0 px-4">
          <div className="flex items-center gap-3 overflow-hidden w-full">
            <div className="bg-emerald-500 p-2 rounded-lg shrink-0 flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className={`text-xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              Edu<span className="text-emerald-500">Bot</span> Faculty
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems[item.title];
              
              const isChildActive = item.children?.some(child => child.id === activeTab);
              const isDirectActive = item.id === activeTab;
              const isActiveGroup = isChildActive || isDirectActive;

              return (
                <div key={index} className="mb-1">
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpand(item.title);
                      } else if (item.id) {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActiveGroup 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    title={!isOpen ? item.title : undefined}
                  >
                    <Icon size={20} className={`shrink-0 ${isActiveGroup ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    
                    <div className={`flex-1 flex items-center justify-between overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                      <span className="font-medium whitespace-nowrap">{item.title}</span>
                      {hasChildren && (
                        isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </div>
                  </button>

                  {/* Children Dropdown */}
                  {hasChildren && isExpanded && isOpen && (
                    <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1 animate-fade-in-up">
                      {item.children?.map(child => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setActiveTab(child.id);
                            if (window.innerWidth < 1024) setIsOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeTab === child.id
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          {child.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                // Mock logout
                window.location.href = '/';
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors group"
            >
              <LogOut size={20} className="shrink-0 text-red-500 group-hover:text-red-600" />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
      `}</style>
    </>
  );
}
