import { useState, useEffect } from 'react';
import { Search, Plus, Send, MessageSquare, Mail, Bell, Smartphone, Edit, X, CheckCircle } from 'lucide-react';

export default function AdminCommunication({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Announcements State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editAnnId, setEditAnnId] = useState<string | null>(null);
  const [annForm, setAnnForm] = useState({ title: '', audience: 'All Students & Staff', status: 'Published', content: '' });
  
  // Messages State
  const [messages, setMessages] = useState<any[]>([]);
  const [msgForm, setMsgForm] = useState({ type: 'Email', audience: 'All Students', subject: '', body: '' });

  // Internal Chat State
  const [internalChats, setInternalChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAnnouncements = () => {
    fetch('/api/announcements').then(res => res.json()).then(data => setAnnouncements(Array.isArray(data) ? data : [])).catch(console.error);
  };

  const fetchMessages = () => {
    fetch('/api/messages').then(res => res.json()).then(data => setMessages(Array.isArray(data) ? data : [])).catch(console.error);
  };

  const fetchInternalChats = () => {
    fetch('/api/internal-chat').then(res => res.json()).then(data => setInternalChats(Array.isArray(data) ? data : [])).catch(console.error);
  };
  
  const fetchChatMessages = (chatId: string) => {
    fetch(`/api/internal-chat?chatId=${chatId}`).then(res => res.json()).then(data => setChatMessages(Array.isArray(data) ? data : [])).catch(console.error);
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchMessages();
    fetchInternalChats();
  }, []);

  const saveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(editAnnId ? `/api/announcements?id=${editAnnId}` : '/api/announcements', { 
      method: editAnnId ? 'PUT' : 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(annForm) 
    });
    setSaving(false);
    setShowAnnModal(false);
    setEditAnnId(null);
    setAnnForm({ title: '', audience: 'All Students & Staff', status: 'Published', content: '' });
    setSuccessMsg(editAnnId ? 'Announcement updated successfully!' : 'Announcement published successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    fetchAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
    setSuccessMsg('Announcement deleted successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    fetchAnnouncements();
  };

  const createNewChat = async () => {
    const name = prompt('Enter a name for the new Group Chat:');
    if (!name) return;
    setSaving(true);
    await fetch('/api/internal-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'CREATE_CHAT', name, type: 'Group' }) });
    setSaving(false);
    fetchInternalChats();
  };

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !activeChatId) return;
    
    await fetch('/api/internal-chat', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ action: 'SEND_MESSAGE', chatId: activeChatId, senderId: 'admin', senderName: 'Administrator', content: newChatMessage }) 
    });
    
    setNewChatMessage('');
    fetchChatMessages(activeChatId);
    fetchInternalChats();
  };

  useEffect(() => {
    if (activeChatId) {
      fetchChatMessages(activeChatId);
      const interval = setInterval(() => fetchChatMessages(activeChatId), 3000);
      return () => clearInterval(interval);
    }
  }, [activeChatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msgForm) });
    setSaving(false);
    setMsgForm({ type: 'Email', audience: 'All Students', subject: '', body: '' });
    setSuccessMsg('Message sent successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    fetchMessages();
  };

  const filteredAnnouncements = announcements.filter(a => a.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  const emailLogs = messages.filter(m => m.type === 'Email');
  const smsLogs = messages.filter(m => m.type === 'SMS');

  const renderAnnouncements = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Announcements</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and broadcast institutional notices.</p>
        </div>
        <button onClick={() => { setEditAnnId(null); setAnnForm({ title: '', audience: 'All Students & Staff', status: 'Published', content: '' }); setShowAnnModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> New Announcement
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editAnnId ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button onClick={() => setShowAnnModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={saveAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                <input type="text" required value={annForm.title} onChange={e => setAnnForm({...annForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Audience</label>
                <select value={annForm.audience} onChange={e => setAnnForm({...annForm, audience: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm">
                  <option>All Students & Staff</option>
                  <option>Students Only</option>
                  <option>Faculty & Staff Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select value={annForm.status} onChange={e => setAnnForm({...annForm, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm">
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAnnModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60">
                  {saving ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Audience</th>
                <th className="p-4">Date Posted</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAnnouncements.map((ann, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Bell size={20} />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{ann.title}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{ann.audience}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(ann.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      ann.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {ann.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditAnnId(ann.id);
                          setAnnForm({ title: ann.title, audience: ann.audience, status: ann.status, content: ann.content || '' });
                          setShowAnnModal(true);
                        }}
                        className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAnnouncements.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No announcements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSend = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Send Message</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Compose and send emails, SMS, or app notifications.</p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <form className="space-y-6" onSubmit={sendMessage}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message Type</label>
              <select value={msgForm.type} onChange={e => setMsgForm({...msgForm, type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option>Email</option>
                <option>SMS</option>
                <option>Push Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Audience</label>
              <select value={msgForm.audience} onChange={e => setMsgForm({...msgForm, audience: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option>All Students</option>
                <option>All Faculty</option>
                <option>Specific Department</option>
                <option>Parents</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject (for Email/App)</label>
              <input type="text" value={msgForm.subject} onChange={e => setMsgForm({...msgForm, subject: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Enter subject..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message Body *</label>
              <textarea required rows={6} value={msgForm.body} onChange={e => setMsgForm({...msgForm, body: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Type your message here..."></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60">
              <Send size={18} /> {saving ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Internal Chat System</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Communicate with staff and administrators.</p>
        </div>
        <button onClick={createNewChat} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <MessageSquare size={18} /> New Group Chat
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex h-[600px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-700 dark:text-slate-200">Chat Groups</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {internalChats.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left p-3 rounded-xl transition-colors flex flex-col gap-1 ${activeChatId === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`font-bold ${activeChatId === chat.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {chat.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {chat.messages && chat.messages.length > 0 ? (
                    <span>{chat.messages[0].senderName}: {chat.messages[0].content}</span>
                  ) : (
                    <span className="italic">No messages yet</span>
                  )}
                </div>
              </button>
            ))}
            {internalChats.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-sm">No chat groups available.</div>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-slate-50 dark:bg-slate-900/50">
          {activeChatId ? (
            <>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  {internalChats.find(c => c.id === activeChatId)?.name}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.senderId === 'admin' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <span className="text-xs text-slate-500 mb-1 ml-1">{msg.senderName}</span>
                    <div className={`px-4 py-2 rounded-2xl ${msg.senderId === 'admin' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-400 italic">No messages in this chat. Start the conversation!</div>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={sendChatMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newChatMessage}
                    onChange={e => setNewChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                  <button type="submit" disabled={!newChatMessage.trim()} className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <MessageSquare size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
              <p>Select a chat group to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmail = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Email Gateway Logs</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track automated and bulk email communications.</p>
        </div>
        <button onClick={() => alert('Opening SMTP gateway settings...')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Mail size={18} /> SMTP Settings
        </button>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6">Campaign / Subject</th>
              <th className="p-4">Recipients</th>
              <th className="p-4">Sent Date</th>
              <th className="p-4">Delivery Rate</th>
              <th className="p-4 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {emailLogs.map((log, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">{log.subject || 'No Subject'}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{log.audience}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(log.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">100%</td>
                <td className="p-4 pr-6 text-right">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    Delivered
                  </span>
                </td>
              </tr>
            ))}
            {emailLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No email logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSMS = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">SMS Notifications</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View SMS delivery logs and credit balances.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Smartphone size={18} /> Buy Credits
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Available Credits</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">14,250</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Sent This Month</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{smsLogs.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Delivery Success</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">97.4%</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6">Message Preview</th>
              <th className="p-4">Recipients</th>
              <th className="p-4">Date</th>
              <th className="p-4 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {smsLogs.map((log, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{log.body}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{log.audience}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(log.createdAt).toLocaleDateString()}</td>
                <td className="p-4 pr-6 text-right">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    Delivered
                  </span>
                </td>
              </tr>
            ))}
            {smsLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No SMS logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'announcements-create':
      return renderAnnouncements();
    case 'announcements-send':
      return renderSend();
    case 'comm-chat':
      return renderChat();
    case 'comm-email':
      return renderEmail();
    case 'comm-sms':
      return renderSMS();
    default:
      return renderAnnouncements();
  }
}
