import { useState } from 'react';
import { 
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calendar
} from 'lucide-react';

export default function FacultyNotifications() {
  const [notifications, setNotifications] = useState([
    { title: 'New Leave Request Approved', desc: 'Your Casual Leave for Oct 12 has been approved by the HOD.', time: '2 hours ago', icon: CheckCircle2, color: 'emerald', unread: true },
    { title: 'Exam Duty Assigned', desc: 'You have been assigned as Chief Invigilator for CS402 on Nov 12.', time: '5 hours ago', icon: Calendar, color: 'blue', unread: true },
    { title: 'Student Message', desc: 'Alice Smith sent you a message regarding the recent assignment.', time: '1 day ago', icon: MessageSquare, color: 'purple', unread: false },
    { title: 'Attendance Reminder', desc: 'You have not submitted attendance for CS401 Batch B today.', time: '2 days ago', icon: AlertCircle, color: 'orange', unread: false },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map((notif, i) => {
            const Icon = notif.icon;
            return (
              <div key={i} className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer ${notif.unread ? 'bg-slate-50/50' : 'bg-white'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-${notif.color}-100 text-${notif.color}-600`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                    <span className="text-xs font-medium text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-500">{notif.desc}</p>
                </div>
                {notif.unread && (
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
