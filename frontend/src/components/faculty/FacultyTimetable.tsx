import { useState, useRef } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users,
  Calendar,
  CheckCircle2,
  Download,
  X
} from 'lucide-react';

interface FacultyTimetableProps {
  activeTab: string;
}

export default function FacultyTimetable({ activeTab }: FacultyTimetableProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isRescheduleRequested, setIsRescheduleRequested] = useState(false);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // Mock download logic
      const blob = new Blob(["This is a mockup timetable PDF for Faculty."], { type: 'application/pdf' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Faculty_Timetable.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const handleRequestReschedule = () => {
    setIsRescheduling(true);
    setTimeout(() => {
      setIsRescheduling(false);
      setIsRescheduleRequested(true);
      setTimeout(() => setIsRescheduleRequested(false), 3000);
    }, 1500);
  };

  const [attendanceTaken, setAttendanceTaken] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-10-19');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<any>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      // @ts-ignore
      if (typeof dateInputRef.current.showPicker === 'function') {
        // @ts-ignore
        dateInputRef.current.showPicker();
      }
    }
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      setIsExportingPDF(false);
      // Mock download logic
      const blob = new Blob(["This is a mockup Exam Schedule PDF."], { type: 'application/pdf' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Exam_Schedule.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const handleTakeAttendance = (index: number) => {
    if (!attendanceTaken.includes(index)) {
      setAttendanceTaken(prev => [...prev, index]);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const renderWeeklySchedule = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Weekly Schedule</h2>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`px-4 py-2 bg-white border border-slate-200 font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2
              ${isDownloading ? 'text-slate-400 cursor-wait' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </>
            ) : (
              <>
                <Download size={16}/> Download PDF
              </>
            )}
          </button>
          <button 
            onClick={handleRequestReschedule}
            disabled={isRescheduling || isRescheduleRequested}
            className={`px-4 py-2 font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2
              ${isRescheduleRequested ? 'bg-emerald-100 text-emerald-700 cursor-default' : 
                isRescheduling ? 'bg-emerald-400 text-white cursor-not-allowed' : 
                'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            {isRescheduling ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending Request...
              </>
            ) : isRescheduleRequested ? (
              <>
                <CheckCircle2 size={16}/> Request Sent
              </>
            ) : (
              'Request Reschedule'
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 w-24 text-center border-r border-slate-200">Time</th>
                <th className="px-4 py-4 w-1/5 text-center">Monday</th>
                <th className="px-4 py-4 w-1/5 text-center bg-emerald-50 text-emerald-800 border-x border-emerald-100">Tuesday (Today)</th>
                <th className="px-4 py-4 w-1/5 text-center">Wednesday</th>
                <th className="px-4 py-4 w-1/5 text-center">Thursday</th>
                <th className="px-4 py-4 w-1/5 text-center">Friday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { 
                  time: '09:00 AM', 
                  mon: { subject: 'CS401', room: 'Room 302', type: 'Lecture' },
                  tue: null,
                  wed: { subject: 'CS401', room: 'Room 302', type: 'Lecture' },
                  thu: { subject: 'CS402', room: 'Room 304', type: 'Lecture' },
                  fri: null
                },
                { 
                  time: '10:00 AM', 
                  mon: null,
                  tue: { subject: 'CS402', room: 'Room 304', type: 'Lecture', current: true },
                  wed: null,
                  thu: null,
                  fri: { subject: 'CS401', room: 'Room 302', type: 'Lecture' }
                },
                { 
                  time: '11:00 AM', 
                  mon: { subject: 'CS401 Lab', room: 'Lab 2', type: 'Practical' },
                  tue: { subject: 'CS401 Lab', room: 'Lab 2', type: 'Practical' },
                  wed: null,
                  thu: { subject: 'Meeting', room: 'Faculty Room', type: 'Admin' },
                  fri: null
                }
              ].map((slot, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-bold text-slate-500 border-r border-slate-200 text-center">{slot.time}</td>
                  
                  {/* Monday */}
                  <td className="px-2 py-2">
                    {slot.mon && (
                      <div className={`p-3 rounded-xl border h-full flex flex-col justify-center items-center text-center
                        ${slot.mon.type === 'Practical' ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                        <span className="font-bold">{slot.mon.subject}</span>
                        <span className="text-xs opacity-80 mt-1">{slot.mon.room}</span>
                      </div>
                    )}
                  </td>

                  {/* Tuesday */}
                  <td className="px-2 py-2 bg-emerald-50/30 border-x border-emerald-50">
                    {slot.tue && (
                      <div className={`p-3 rounded-xl border h-full flex flex-col justify-center items-center text-center shadow-sm
                        ${slot.tue.current ? 'bg-emerald-500 border-emerald-600 text-white ring-2 ring-emerald-200 ring-offset-1' : slot.tue.type === 'Practical' ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                        <span className="font-bold">{slot.tue.subject}</span>
                        <span className={`text-xs mt-1 ${slot.tue.current ? 'text-emerald-100' : 'opacity-80'}`}>{slot.tue.room}</span>
                      </div>
                    )}
                  </td>

                  {/* Wednesday */}
                  <td className="px-2 py-2">
                    {slot.wed && (
                      <div className="p-3 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 h-full flex flex-col justify-center items-center text-center">
                        <span className="font-bold">{slot.wed.subject}</span>
                        <span className="text-xs opacity-80 mt-1">{slot.wed.room}</span>
                      </div>
                    )}
                  </td>

                  {/* Thursday */}
                  <td className="px-2 py-2">
                    {slot.thu && (
                      <div className={`p-3 rounded-xl border h-full flex flex-col justify-center items-center text-center
                        ${slot.thu.type === 'Admin' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                        <span className="font-bold">{slot.thu.subject}</span>
                        <span className="text-xs opacity-80 mt-1">{slot.thu.room}</span>
                      </div>
                    )}
                  </td>

                  {/* Friday */}
                  <td className="px-2 py-2">
                    {slot.fri && (
                      <div className="p-3 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 h-full flex flex-col justify-center items-center text-center">
                        <span className="font-bold">{slot.fri.subject}</span>
                        <span className="text-xs opacity-80 mt-1">{slot.fri.room}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const getClassesForDate = (dateString: string) => {
    const day = new Date(dateString).getDay();
    // Provide different mock routines based on day of week
    switch(day) {
      case 1: // Monday
        return [
          { time: '09:00 AM - 10:30 AM', course: 'CS301: Database Systems', type: 'Lecture', room: 'Room 201', batch: 'Batch C', active: true },
          { time: '11:00 AM - 01:00 PM', course: 'CS401: Data Structures Lab', type: 'Practical', room: 'Lab 3', batch: 'Batch A2', active: false },
        ];
      case 2: // Tuesday
        return [
          { time: '10:00 AM - 11:00 AM', course: 'CS402: Operating Systems', type: 'Lecture', room: 'Room 304', batch: 'Batch B', active: true },
          { time: '02:00 PM - 03:00 PM', course: 'Project Mentoring', type: 'Administrative', room: 'Staff Room', batch: 'Final Year', active: false },
        ];
      case 3: // Wednesday
        return [
          { time: '08:00 AM - 10:00 AM', course: 'CS401: Data Structures Lab', type: 'Practical', room: 'Computer Lab 2', batch: 'Batch A1', active: false },
          { time: '10:30 AM - 11:30 AM', course: 'CS402: Operating Systems', type: 'Lecture', room: 'Room 304', batch: 'Batch B', active: true },
          { time: '12:00 PM - 01:00 PM', course: 'CS505: Machine Learning', type: 'Lecture', room: 'Room 401', batch: 'Masters', active: false },
        ];
      case 4: // Thursday
        return [
          { time: '09:00 AM - 11:00 AM', course: 'CS505: Machine Learning Lab', type: 'Practical', room: 'AI Lab', batch: 'Masters', active: true },
          { time: '01:00 PM - 02:00 PM', course: 'Faculty Meeting', type: 'Administrative', room: 'Conference Hall', batch: 'All CS Faculty', active: false }
        ];
      case 5: // Friday
        return [
          { time: '10:00 AM - 12:00 PM', course: 'CS301: Database Systems', type: 'Lecture', room: 'Room 201', batch: 'Batch C', active: false },
          { time: '02:00 PM - 04:00 PM', course: 'Weekly Seminar', type: 'Administrative', room: 'Auditorium', batch: 'All Students', active: true },
        ];
      default: // Weekend
        return [
          { time: '09:00 AM - 12:00 PM', course: 'Extra Classes', type: 'Lecture', room: 'Room 101', batch: 'Remedial', active: false }
        ];
    }
  };

  const renderTodaysClasses = () => {
    const todayClasses = getClassesForDate(selectedDate);
    
    return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Today's Schedule</h2>
        <div 
          onClick={handleDateClick}
          className="relative px-4 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center gap-2 overflow-hidden hover:bg-emerald-200 transition-colors cursor-pointer"
        >
          <Calendar size={18} /> {formatDisplayDate(selectedDate)}
          <input 
            ref={dateInputRef}
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="absolute -top-10 -left-10 w-0 h-0 opacity-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {todayClasses.map((cls, i) => (
          <div key={i} className={`bg-white rounded-2xl border p-6 flex flex-col relative overflow-hidden transition-all
            ${cls.active ? 'border-emerald-200 shadow-md ring-1 ring-emerald-500' : 'border-slate-100 shadow-sm'}
          `}>
            {cls.active && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
            )}
            <div className="flex justify-between items-start mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                ${cls.type === 'Lecture' ? 'bg-blue-100 text-blue-800' : cls.type === 'Practical' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                {cls.type}
              </span>
              {cls.active && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ONGOING
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-4">{cls.course}</h3>
            
            <div className="space-y-3 mt-auto">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Clock size={18} className={cls.active ? 'text-emerald-500' : 'text-slate-400'}/>
                {cls.time}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <MapPin size={18} className={cls.active ? 'text-emerald-500' : 'text-slate-400'}/>
                {cls.room}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Users size={18} className={cls.active ? 'text-emerald-500' : 'text-slate-400'}/>
                {cls.batch}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => handleTakeAttendance(i)}
                disabled={attendanceTaken.includes(i)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2
                ${attendanceTaken.includes(i) ? 'bg-emerald-100 text-emerald-800 cursor-default' : 
                  cls.active ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' : 
                  'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              >
                {attendanceTaken.includes(i) ? (
                  <>
                    <CheckCircle2 size={18} />
                    Attendance Recorded
                  </>
                ) : (
                  'Take Attendance'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  };

  const renderExamSchedule = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Exam Schedule / Invigilation Duties</h2>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className={`px-4 py-2 bg-white border border-slate-200 font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2
              ${isExportingPDF ? 'text-slate-400 cursor-wait' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            {isExportingPDF ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </>
            ) : (
              <>
                <Download size={16}/> Export as PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-6 text-lg">Upcoming Invigilation Duties</h3>
        
        <div className="space-y-4">
          {[
            { date: 'Mon, Nov 12', time: '09:00 AM - 12:00 PM', exam: 'Mid-Term 2: Data Structures', room: 'Main Hall A', role: 'Chief Invigilator', active: false },
            { date: 'Wed, Nov 14', time: '02:00 PM - 05:00 PM', exam: 'Mid-Term 2: Operating Systems', room: 'Room 304', role: 'Invigilator', active: false },
            { date: 'Fri, Nov 16', time: '10:00 AM - 01:00 PM', exam: 'Mid-Term 2: Computer Networks', room: 'Room 201', role: 'Reliever', active: false },
          ].map((duty, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-blue-700 w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-xs uppercase">{duty.date.split(',')[0]}</span>
                  <span className="text-lg leading-tight">{duty.date.split(' ')[2]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{duty.exam}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                      <Clock size={16} className="text-slate-400" /> {duty.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                      <MapPin size={16} className="text-slate-400" /> {duty.room}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 md:flex-col md:items-end">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {duty.role}
                </span>
                <button 
                  onClick={() => setSelectedDuty(duty)}
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="text-slate-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage schedules.
        </p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timetable':
      case 'timetable-weekly':
        return renderWeeklySchedule();
      case 'timetable-today':
        return renderTodaysClasses();
      case 'timetable-exam':
        return renderExamSchedule();
      default:
        return renderPlaceholder('Timetable Management', CalendarDays);
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* Duty Details Modal */}
      {selectedDuty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Duty Details</h3>
              <button 
                onClick={() => setSelectedDuty(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Examination</p>
                <p className="font-bold text-slate-800 text-lg">{selectedDuty.exam}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5"><CalendarDays size={14}/> Date</p>
                  <p className="font-bold text-slate-800">{selectedDuty.date}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5"><Clock size={14}/> Time</p>
                  <p className="font-bold text-slate-800">{selectedDuty.time.split(' - ')[0]}</p>
                </div>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Room Allocation</span>
                  <span className="font-bold text-slate-800">{selectedDuty.room}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Assigned Role</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">{selectedDuty.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Reporting Time</span>
                  <span className="font-bold text-rose-600">{
                    // calculate 30 mins before
                    selectedDuty.time.split(' - ')[0].replace('10:00', '09:30').replace('09:00', '08:30').replace('02:00', '01:30')
                  }</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <button 
                onClick={() => {
                  alert('Change request initiated.');
                  setSelectedDuty(null);
                }}
                className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                Request Change
              </button>
              <button 
                onClick={() => setSelectedDuty(null)}
                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Acknowledge Duty
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
