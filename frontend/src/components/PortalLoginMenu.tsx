import { useState, useRef, useEffect } from 'react';
import { GraduationCap, UserCheck, ShieldCheck, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const portalData = [
  {
    title: "Student Login",
    icon: GraduationCap,
    path: "/student/login",
    description: "Access courses, attendance, assignments, fees, and results."
  },
  {
    title: "Faculty Login",
    icon: UserCheck,
    path: "/faculty/login",
    description: "Manage classes, attendance, students, and course materials."
  },
  {
    title: "Admin Login",
    icon: ShieldCheck,
    path: "/admin/login",
    description: "Manage users, admissions, finance, reports, and institute settings."
  }
];

export default function PortalLoginMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
      >
        Portal Login
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Dropdown Menu / Bottom Sheet */}
      <div
        ref={menuRef}
        role="menu"
        className={`fixed bottom-0 left-0 right-0 md:absolute md:top-full md:bottom-auto md:left-auto md:right-0 md:mt-3 md:w-80 md:rounded-xl bg-white rounded-t-2xl shadow-2xl z-50 overflow-hidden transform transition-all duration-300 ease-in-out origin-top
          ${isOpen 
            ? 'translate-y-0 md:translate-y-0 opacity-100 scale-100 pointer-events-auto' 
            : 'translate-y-full md:translate-y-4 opacity-0 md:scale-95 pointer-events-none'
          }
        `}
      >
        <div className="p-2 md:p-3 space-y-1">
          {/* Mobile Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 md:hidden" />
          
          <div className="px-4 py-2 md:hidden">
            <h3 className="text-lg font-bold text-slate-800">Select Portal</h3>
            <p className="text-sm text-slate-500">Choose your login destination</p>
          </div>

          {portalData.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  navigate(portal.path);
                }}
                role="menuitem"
                className="cursor-pointer group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-emerald-600 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300 shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-white transition-colors duration-300 mb-1">
                    {portal.title}
                  </h4>
                  <p className="text-sm text-slate-500 group-hover:text-emerald-100 transition-colors duration-300 line-clamp-2">
                    {portal.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
