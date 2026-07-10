import { useState, useRef } from 'react';
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
  const [selectedChatIndex, setSelectedChatIndex] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Alice Johnson',
      isMe: false,
      text: 'Hello Professor, I had a question regarding the recent AVL Trees assignment. Could you explain the balancing factor calculation again?',
      time: '10:42 AM'
    },
    {
      id: 2,
      sender: 'Me',
      isMe: true,
      text: 'Sure Alice, the balance factor is calculated as the height of the left subtree minus the height of the right subtree. Let me share a diagram.',
      time: '10:45 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  
  const [announcementSubject, setAnnouncementSubject] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sentEmails, setSentEmails] = useState([
    { subject: 'Important: Assignment 2 Deadline Extension', to: 'Batch B Students', time: '10:30 AM', preview: 'Dear Students, the deadline for...', read: false },
    { subject: 'Mid-Term 1 Syllabus', to: 'CS401 All Students', time: 'Yesterday', preview: 'Please find attached the syllabus...', read: true },
    { subject: 'Re: Attendance Query', to: 'Alice Smith', time: 'Oct 24', preview: 'Yes, your medical certificate has been...', read: true },
  ]);

  const docInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'Me',
        isMe: true,
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setInputText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'Me',
        isMe: true,
        text: `📎 Sent a file: ${e.target.files[0].name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      e.target.value = '';
    }
  };

  const getChats = (type: 'students' | 'admin') => [
    { name: type === 'students' ? 'Alice Smith' : 'IT Helpdesk', role: type === 'students' ? 'CS24-001' : 'Support', time: '10:42 AM', preview: 'Can you help me with...' },
    { name: type === 'students' ? 'Batch B Group' : 'Exam Branch', role: type === 'students' ? '60 Students' : 'Admin', time: 'Yesterday', preview: 'The assignment is due on...' },
    { name: type === 'students' ? 'Charlie Davis' : 'HOD Computer Science', role: type === 'students' ? 'CS24-003' : 'Management', time: 'Monday', preview: 'Approved the syllabus.' },
  ];

  const renderChat = (type: 'students' | 'admin') => {
    const chats = getChats(type);
    const activeChat = chats[selectedChatIndex] || chats[0];

    return (
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
          {chats.map((chat, i) => (
            <div 
              key={i} 
              onClick={() => {
                setSelectedChatIndex(i);
                setMessages([{
                  id: Date.now(),
                  sender: chat.name,
                  isMe: false,
                  text: `Hi, this is ${chat.name}. How can I help you?`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
              }}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors flex gap-3
              ${selectedChatIndex === i ? 'bg-white border-l-4 border-l-emerald-500' : 'hover:bg-slate-100/50'}`}>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                {chat.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-semibold truncate ${selectedChatIndex === i ? 'text-slate-900' : 'text-slate-700'}`}>{chat.name}</h4>
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
              {activeChat.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{activeChat.name}</h3>
              <p className="text-xs text-slate-500">{activeChat.role} • Online</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="text-center text-xs text-slate-400 my-4">Today</div>
          
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`${msg.isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'} p-3 rounded-2xl max-w-[75%] shadow-sm`}>
                <p className="text-sm">{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${msg.isMe ? 'text-emerald-200 text-right' : 'text-slate-400'}`}>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <input type="file" ref={docInputRef} className="hidden" onChange={handleFileUpload} />
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            
            <button onClick={() => docInputRef.current?.click()} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
              <Paperclip size={20} />
            </button>
            <button onClick={() => imageInputRef.current?.click()} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
              <ImageIcon size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent py-2 px-2 focus:outline-none text-sm"
            />
            <button onClick={handleSendMessage} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

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
            <input 
              type="text" 
              placeholder="e.g. Change in Lab Schedule" 
              value={announcementSubject}
              onChange={(e) => setAnnouncementSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Message Content</label>
          <textarea 
            rows={6} 
            placeholder="Write your announcement here..." 
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
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
          <button 
            onClick={() => {
              setAnnouncementSubject('');
              setAnnouncementContent('');
            }}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={() => {
              if (announcementSubject || announcementContent) {
                alert('Announcement successfully broadcasted to selected students!');
                setAnnouncementSubject('');
                setAnnouncementContent('');
              }
            }}
            className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Megaphone size={18} /> Broadcast Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmailNotifications = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{isComposingEmail ? 'Compose Email' : 'Email Notifications'}</h2>
        {!isComposingEmail && (
          <button 
            onClick={() => setIsComposingEmail(true)}
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Mail size={18} /> Compose New Email
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isComposingEmail ? (
          <div className="p-6 md:p-8">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
                <input 
                  type="text" 
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="Recipient email address" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea 
                  rows={8} 
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Write your email here..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => {
                  setIsComposingEmail(false);
                  setEmailTo('');
                  setEmailSubject('');
                  setEmailMessage('');
                }}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (emailTo || emailSubject || emailMessage) {
                    setSentEmails([{
                      subject: emailSubject || '(No Subject)',
                      to: emailTo || 'Unknown',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      preview: emailMessage.substring(0, 50) + '...',
                      read: true
                    }, ...sentEmails]);
                  }
                  setEmailTo('');
                  setEmailSubject('');
                  setEmailMessage('');
                  setIsComposingEmail(false);
                }}
                className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send size={18} /> Send Email
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search emails..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <select className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700 bg-white">
                <option>All Mail</option>
                <option>Sent Mail</option>
                <option>Drafts</option>
              </select>
            </div>

            <div className="divide-y divide-slate-100">
              {sentEmails.map((email, i) => (
                <div key={i} className={`p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${!email.read ? 'bg-slate-50/50' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-semibold text-slate-800 truncate pr-4 ${!email.read ? 'font-bold' : ''}`}>{email.subject}</h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{email.time}</span>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">To: {email.to}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{email.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
    case 'communication':
    case 'comm-students':
      return renderChat('students');
    case 'comm-admin':
      return renderChat('admin');
    case 'comm-announcements':
      return renderAnnouncements();
    case 'comm-email':
      return renderEmailNotifications();
    default:
      return renderPlaceholder('Communication', MessageSquare);
  }
}
