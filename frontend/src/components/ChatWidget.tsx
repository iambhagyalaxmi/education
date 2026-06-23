import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, RotateCcw, Bot } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

const QUICK_REPLIES = [
  '🎓 Admission process',
  '📚 Available courses',
  '💰 Fee structure',
  '🏆 Scholarships',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Use a random session ID to track conversation history on the server
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    
    setMessages((prev) => [...prev, { sender: 'user', content: msg, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);
    setShowQuickReplies(false);

    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', content: data.content, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: 'system', content: 'Connection failed. Please check your network or try again later.', timestamp: new Date() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = async () => {
    setMessages([]);
    setShowQuickReplies(true);
    try {
      await fetch(`${API_URL}/api/chat/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch (e) {
      // ignore
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {isOpen && (
        <div
          className="w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200/60 bg-slate-50"
          style={{ height: '600px', maxHeight: 'calc(100vh - 6rem)' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 shrink-0 shadow-sm relative z-10"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            <div className="relative shrink-0 flex items-center justify-center w-11 h-11 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">
              <Bot className="text-white w-6 h-6" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1d4ed8] bg-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-base leading-tight tracking-wide">EduBot Assistant</h2>
              <p className="text-blue-100/90 text-[11px] font-medium uppercase tracking-wider mt-0.5">
                Online • Ready to help
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={handleReset} title="Reset conversation" className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scroll-smooth bg-slate-50/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">How can we help?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Ask me anything about admissions, courses, fees, or scholarships. I'm here 24/7!
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-full ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender !== 'user' && (
                  <div className="w-8 h-8 rounded-full shrink-0 bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div className={`flex flex-col gap-1 min-w-[60px] max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-[14px] leading-[1.6] whitespace-pre-wrap break-words
                      ${msg.sender === 'user'
                        ? 'text-white rounded-tr-sm shadow-md'
                        : 'text-slate-800 rounded-tl-sm shadow-sm border border-slate-200/60'
                      }`}
                    style={
                      msg.sender === 'user'
                        ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }
                        : { background: '#ffffff' }
                    }
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium px-1 uppercase tracking-wider">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-end">
                <div className="w-8 h-8 rounded-full shrink-0 bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-white border border-slate-200/60 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
                  <div className="flex gap-1.5 items-center h-2">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {showQuickReplies && messages.length === 0 && (
            <div className="px-5 py-3 shrink-0 flex flex-wrap gap-2 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-10">
              {QUICK_REPLIES.map((r) => (
                <button key={r} onClick={() => sendMessage(r)} className="text-[13px] text-blue-700 font-medium px-3.5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-blue-50 hover:bg-blue-100 border border-blue-100/50">
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 shrink-0 bg-white border-t border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-20">
            <div className="flex items-end gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 shadow-inner">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none resize-none px-3 py-2.5 max-h-[120px]"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-white"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
            <div className="flex justify-center items-center mt-3 gap-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Powered by EduBot AI</span>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
      >
        {isOpen ? <X size={28} className="text-white" /> : <MessageCircle size={28} className="text-white" />}
        {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-[3px] border-white animate-pulse" />}
      </button>
    </div>
  );
}
