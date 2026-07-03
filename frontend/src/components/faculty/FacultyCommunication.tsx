import { 
  MessageSquare, 
  Search,
  Send,
  Megaphone,
  Mail,
  Paperclip,
  Image as ImageIcon
} from 'lucide-react';

interface FacultyCommunicationProps {
  activeTab: string;
}

export default function FacultyCommunication({ activeTab }: FacultyCommunicationProps) {

  const renderChat = (type: 'students' | 'admin') => (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">{type === 'students' ? 'Student Chat' : 'Admin Chat'}</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search ${type}...`}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[
            { name: type === 'students' ? 'Alice Smith' : 'IT Helpdesk', role: type === 'students' ? 'CS24-001' : 'Support', time: '10:42 AM', preview: 'Can you help me with...', active: true },
            { name: type === 'students' ? 'Batch B Group' : 'Exam Branch', role: type === 'students' ? '60 Students' : 'Admin', time: 'Yesterday', preview: 'The assignment is due on...', active: false },
            { name: type === 'students' ? 'Charlie Davis' : 'HOD Computer Science', role: type === 'students' ? 'CS24-003' : 'Management', time: 'Monday', preview: 'Approved the syllabus.', active: false },
          ].map((chat, i) => (
            <div key={i} className={`p-4 border-b border-slate-100 cursor-pointer transition-colors flex gap-3
              ${chat.active ? 'bg-white border-l-4 border-l-emerald-500' : 'hover:bg-slate-100/50'}`}>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                {chat.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-semibold truncate ${chat.active ? 'text-slate-900' : 'text-slate-700'}`}>{chat.name}</h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{chat.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {type === 'students' ? 'A' : 'I'}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{type === 'students' ? 'Alice Smith' : 'IT Helpdesk'}</h3>
              <p className="text-xs text-slate-500">{type === 'students' ? 'Roll: CS24-001 • Online' : 'Active now'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-700 p-3 rounded-2xl rounded-tl-sm max-w-[75%] shadow-sm">
              <p className="text-sm">Hello Professor, I had a question regarding the recent AVL Trees assignment. Could you explain the balancing factor calculation again?</p>
              <span className="text-[10px] text-slate-400 mt-1 block">10:42 AM</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[75%] shadow-sm">
              <p className="text-sm">Sure Alice, the balance factor is calculated as the height of the left subtree minus the height of the right subtree. Let me share a diagram.</p>
              <span className="text-[10px] text-emerald-200 mt-1 block text-right">10:45 AM</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
              <Paperclip size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
              <ImageIcon size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type a message..."
              className="flex-1 bg-transparent py-2 px-2 focus:outline-none text-sm"
            />
            <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Send Announcements</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>All Students (CS401)</option>
              <option>Batch A Only</option>
              <option>Batch B Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Announcement Subject</label>
            <input type="text" placeholder="e.g. Change in Lab Schedule" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Message Content</label>
          <textarea rows={6} placeholder="Write your announcement here..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
            Send as Push Notification
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" defaultChecked />
            Send via Email
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Discard</button>
          <button className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
            <Megaphone size={18} /> Broadcast Now
          </button>
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
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage communication workflows.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'comm-students':
      return renderChat('students');
    case 'comm-admin':
      return renderChat('admin');
    case 'comm-announcements':
      return renderAnnouncements();
    case 'comm-email':
      return renderPlaceholder('Email Notifications', Mail);
    default:
      return renderPlaceholder('Communication', MessageSquare);
  }
}
