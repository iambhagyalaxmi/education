import { useState, useEffect } from 'react';
import { 
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calendar
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  desc: string;
  type: string;
  unread: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, any> = {
  leave: CheckCircle2,
  exam: Calendar,
  message: MessageSquare,
  reminder: AlertCircle,
  info: AlertCircle,
};

const TYPE_COLORS: Record<string, string> = {
  leave: 'emerald',
  exam: 'blue',
  message: 'purple',
  reminder: 'orange',
  info: 'slate',
};

export default function FacultyNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    } catch (e) { console.error(e); }
  };

  const markOneAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (e) { console.error(e); }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
        {notifications.some(n => n.unread) && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <p>No notifications yet. They will appear here as events occur.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => {
              const Icon = TYPE_ICONS[notif.type] || AlertCircle;
              const color = TYPE_COLORS[notif.type] || 'slate';
              const timeAgo = new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={notif.id}
                  onClick={() => notif.unread && markOneAsRead(notif.id)}
                  className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer ${notif.unread ? 'bg-slate-50/50' : 'bg-white'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-${color}-100 text-${color}-600`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                      <span className="text-xs font-medium text-slate-400">{timeAgo}</span>
                    </div>
                    <p className="text-sm text-slate-500">{notif.desc}</p>
                  </div>
                  {notif.unread && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-2 shrink-0"></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
