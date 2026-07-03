import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Building2, 
  CalendarDays, 
  FileEdit, 
  CreditCard, 
  Library, 
  Home, 
  Bus, 
  Calculator, 
  BarChart3, 
  Megaphone, 
  MessageSquare, 
  Settings,
  ShieldAlert,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'dashboard': true,
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      id: 'dashboard',
      subItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Analytics' }
      ]
    },
    {
      title: 'Admissions',
      icon: UserPlus,
      id: 'admissions',
      subItems: [
        { id: 'admissions-new', label: 'New Applications' },
        { id: 'admissions-status', label: 'Admission Status' },
        { id: 'admissions-enrollment', label: 'Enrollment' }
      ]
    },
    {
      title: 'Student Management',
      icon: Users,
      id: 'students',
      subItems: [
        { id: 'students-list', label: 'Student List' },
        { id: 'students-add', label: 'Add Student' },
        { id: 'students-profiles', label: 'Student Profiles' },
        { id: 'students-attendance', label: 'Attendance' },
        { id: 'students-academic', label: 'Academic Records' }
      ]
    },
    {
      title: 'Faculty Management',
      icon: GraduationCap,
      id: 'faculty',
      subItems: [
        { id: 'faculty-list', label: 'Faculty List' },
        { id: 'faculty-add', label: 'Add Faculty' },
        { id: 'faculty-departments', label: 'Departments' },
        { id: 'faculty-workload', label: 'Workload' }
      ]
    },
    {
      title: 'Staff Management',
      icon: Briefcase,
      id: 'staff',
      subItems: [
        { id: 'staff-list', label: 'Staff List' },
        { id: 'staff-add', label: 'Add Staff' },
        { id: 'staff-roles', label: 'Roles & Permissions' }
      ]
    },
    {
      title: 'Course Management',
      icon: BookOpen,
      id: 'courses',
      subItems: [
        { id: 'courses-list', label: 'Courses' },
        { id: 'courses-subjects', label: 'Subjects' },
        { id: 'courses-syllabus', label: 'Syllabus' },
        { id: 'courses-semester', label: 'Semester Management' }
      ]
    },
    {
      title: 'Departments',
      icon: Building2,
      id: 'departments',
      subItems: [
        { id: 'dept-list', label: 'Department List' },
        { id: 'dept-add', label: 'Add Department' }
      ]
    },
    {
      title: 'Class & Timetable',
      icon: CalendarDays,
      id: 'timetable',
      subItems: [
        { id: 'timetable-schedule', label: 'Timetable' },
        { id: 'timetable-allocation', label: 'Classroom Allocation' }
      ]
    },
    {
      title: 'Examinations',
      icon: FileEdit,
      id: 'exams',
      subItems: [
        { id: 'exams-schedule', label: 'Exam Schedule' },
        { id: 'exams-results', label: 'Results' },
        { id: 'exams-grading', label: 'Grade Management' }
      ]
    },
    {
      title: 'Fee Management',
      icon: CreditCard,
      id: 'fees',
      subItems: [
        { id: 'fees-structure', label: 'Fee Structure' },
        { id: 'fees-collection', label: 'Fee Collection' },
        { id: 'fees-pending', label: 'Pending Fees' },
        { id: 'fees-scholarships', label: 'Scholarships' }
      ]
    },
    {
      title: 'Library',
      icon: Library,
      id: 'library',
      subItems: [
        { id: 'library-books', label: 'Books' },
        { id: 'library-issue', label: 'Issue/Return Books' },
        { id: 'library-digital', label: 'Digital Library' }
      ]
    },
    {
      title: 'Hostel Management',
      icon: Home,
      id: 'hostel',
      subItems: [
        { id: 'hostel-rooms', label: 'Hostel Rooms' },
        { id: 'hostel-allocation', label: 'Room Allocation' },
        { id: 'hostel-fees', label: 'Hostel Fees' }
      ]
    },
    {
      title: 'Transport Management',
      icon: Bus,
      id: 'transport',
      subItems: [
        { id: 'transport-routes', label: 'Bus Routes' },
        { id: 'transport-vehicles', label: 'Vehicles' },
        { id: 'transport-drivers', label: 'Driver Details' }
      ]
    },
    {
      title: 'HR & Payroll',
      icon: Calculator,
      id: 'hr',
      subItems: [
        { id: 'hr-salary', label: 'Employee Salary' },
        { id: 'hr-payroll', label: 'Payroll' },
        { id: 'hr-leave', label: 'Leave Approval' }
      ]
    },
    {
      title: 'Reports',
      icon: BarChart3,
      id: 'reports',
      subItems: [
        { id: 'reports-student', label: 'Student Reports' },
        { id: 'reports-faculty', label: 'Faculty Reports' },
        { id: 'reports-financial', label: 'Financial Reports' },
        { id: 'reports-attendance', label: 'Attendance Reports' },
        { id: 'reports-academic', label: 'Academic Reports' }
      ]
    },
    {
      title: 'Announcements',
      icon: Megaphone,
      id: 'announcements',
      subItems: [
        { id: 'announcements-create', label: 'Create Announcement' },
        { id: 'announcements-send', label: 'Send Notifications' }
      ]
    },
    {
      title: 'Communication',
      icon: MessageSquare,
      id: 'communication',
      subItems: [
        { id: 'comm-chat', label: 'Chat' },
        { id: 'comm-email', label: 'Email' },
        { id: 'comm-sms', label: 'SMS Notifications' }
      ]
    }
  ];

  const singleNavItems = [
    { title: 'Settings', icon: Settings, id: 'settings' },
    { title: 'Audit Logs', icon: ShieldAlert, id: 'audit-logs' },
  ];

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
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 
        border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-40
        flex flex-col
        ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-72'}
      `}>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          
          {navItems.map((menu) => {
            const Icon = menu.icon;
            const isExpanded = expandedMenus[menu.id];
            const isActiveCategory = menu.subItems.some(item => activeTab === item.id);
            
            return (
              <div key={menu.id} className="mb-1">
                <button
                  onClick={() => toggleMenu(menu.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors
                    ${isActiveCategory 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActiveCategory ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                    <span className="text-sm">{menu.title}</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Submenu */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-11 pr-3 space-y-1 py-1">
                    {menu.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveTab(subItem.id);
                          if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                          ${activeTab === subItem.id 
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10 font-medium' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>

          {singleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors mb-1
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Icon size={20} className={activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                <span className="text-sm">{item.title}</span>
              </button>
            )
          })}
          
        </div>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <a 
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium w-full"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </a>
        </div>
      </aside>
    </>
  );
}
