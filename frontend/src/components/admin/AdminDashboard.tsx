import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminTopbar from './AdminTopbar';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminAdmissions from './AdminAdmissions';
import AdminStudents from './AdminStudents';
import AdminAnalytics from './AdminAnalytics';
import AdminFaculty from './AdminFaculty';
import AdminCourses from './AdminCourses';
import AdminStaff from './AdminStaff';
import AdminDepartments from './AdminDepartments';
import AdminTimetable from './AdminTimetable';
import AdminExaminations from './AdminExaminations';

// Placeholders
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-md">
      This module is under construction. It will be fully implemented in a future update.
    </p>
  </div>
);

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    if (activeTab === 'overview') {
      return <AdminOverview />;
    }
    if (activeTab === 'analytics') {
      return <AdminAnalytics />;
    }
    if (activeTab.startsWith('admissions-')) {
      return <AdminAdmissions activeTab={activeTab} />;
    }
    if (activeTab.startsWith('students-')) {
      return <AdminStudents activeTab={activeTab} />;
    }
    if (activeTab.startsWith('faculty-')) {
      return <AdminFaculty activeTab={activeTab} />;
    }
    if (activeTab.startsWith('courses-')) {
      return <AdminCourses activeTab={activeTab} />;
    }
    if (activeTab.startsWith('staff-')) {
      return <AdminStaff activeTab={activeTab} />;
    }
    if (activeTab.startsWith('dept-')) {
      return <AdminDepartments activeTab={activeTab} />;
    }
    if (activeTab.startsWith('timetable-')) {
      return <AdminTimetable activeTab={activeTab} />;
    }
    if (activeTab.startsWith('exams-')) {
      return <AdminExaminations activeTab={activeTab} />;
    }
    
    // Convert activeTab ID to a readable title for placeholders
    const titles: Record<string, string> = {
      'analytics': 'Analytics',
      'faculty-list': 'Faculty List',
      'faculty-add': 'Add Faculty',
      'faculty-departments': 'Faculty Departments',
      'faculty-workload': 'Faculty Workload',
      'staff-list': 'Staff List',
      'staff-add': 'Add Staff',
      'staff-roles': 'Roles & Permissions',
      'courses-list': 'Courses',
      'courses-subjects': 'Subjects',
      'courses-syllabus': 'Syllabus',
      'courses-semester': 'Semester Management',
      'dept-list': 'Department List',
      'dept-add': 'Add Department',
      'timetable-schedule': 'Timetable',
      'timetable-allocation': 'Classroom Allocation',
      'exams-schedule': 'Exam Schedule',
      'exams-results': 'Exam Results',
      'exams-grading': 'Grade Management',
      'fees-structure': 'Fee Structure',
      'fees-collection': 'Fee Collection',
      'fees-pending': 'Pending Fees',
      'fees-scholarships': 'Scholarships',
      'library-books': 'Library Books',
      'library-issue': 'Issue/Return Books',
      'library-digital': 'Digital Library',
      'hostel-rooms': 'Hostel Rooms',
      'hostel-allocation': 'Room Allocation',
      'hostel-fees': 'Hostel Fees',
      'transport-routes': 'Bus Routes',
      'transport-vehicles': 'Vehicles',
      'transport-drivers': 'Driver Details',
      'hr-salary': 'Employee Salary',
      'hr-payroll': 'Payroll',
      'hr-leave': 'Leave Approval',
      'reports-student': 'Student Reports',
      'reports-faculty': 'Faculty Reports',
      'reports-financial': 'Financial Reports',
      'reports-attendance': 'Attendance Reports',
      'reports-academic': 'Academic Reports',
      'announcements-create': 'Create Announcement',
      'announcements-send': 'Send Notifications',
      'comm-chat': 'Chat',
      'comm-email': 'Email',
      'comm-sms': 'SMS Notifications',
      'settings': 'Settings',
      'audit-logs': 'Audit Logs'
    };

    return <Placeholder title={titles[activeTab] || 'Module'} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <AdminTopbar />
      
      {/* Mobile Menu Button - Fixed below topbar */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="lg:ml-72 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
