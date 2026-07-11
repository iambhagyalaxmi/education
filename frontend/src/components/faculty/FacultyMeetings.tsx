import { useState, useEffect } from 'react';
import { 
  Video, 
  Link as LinkIcon,
  Copy,
  Plus
} from 'lucide-react';
import axios from 'axios';

interface FacultyMeetingsProps {
  activeTab: string;
}

export default function FacultyMeetings({ activeTab }: FacultyMeetingsProps) {
  const [platform, setPlatform] = useState('Google Meet');
  const [course, setCourse] = useState('CS401: Data Structures - Batch A');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [agenda, setAgenda] = useState('');
  const [scheduledMeetings, setScheduledMeetings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch meetings on mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  async function fetchMeetings() {
    try {
      const res = await axios.get('/api/meetings');
      setScheduledMeetings(res.data);
    } catch (error) {
      console.error('Failed to fetch meetings', error);
    }
  }

  const renderScheduleOnlineClass = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Schedule Online Class</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Platform</label>
            <select 
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>Google Meet</option>
              <option>Zoom</option>
              <option>Microsoft Teams</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course / Batch</label>
            <select 
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>CS401: Data Structures - Batch A</option>
              <option>CS402: Operating Systems - Batch B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700" 
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Mins)</label>
              <input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Meeting Agenda / Topic</label>
          <input 
            type="text" 
            placeholder="e.g. Doubt Clearing Session on Trees" 
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            disabled={isSubmitting}
            onClick={async () => {
              if (date && startTime && agenda) {
                setIsSubmitting(true);
                const newLink = platform === 'Google Meet' 
                  ? `meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}` 
                  : `zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
                
                try {
                  await axios.post('/api/meetings', {
                    course: course.split(':')[0] || course,
                    type: agenda,
                    link: newLink,
                    platform,
                    date,
                    startTime,
                    duration
                  });
                  
                  await fetchMeetings();
                  alert(`Successfully generated and scheduled ${platform} link for ${course}!`);
                  
                  setPlatform('Google Meet');
                  setCourse('CS401: Data Structures - Batch A');
                  setDate('');
                  setStartTime('');
                  setDuration('60');
                  setAgenda('');
                } catch (error) {
                  console.error(error);
                  alert('Failed to schedule meeting. Make sure the backend is running.');
                } finally {
                  setIsSubmitting(false);
                }
              } else {
                alert('Please fill out all required fields (Date, Time, Agenda) to schedule.');
              }
            }}
            className={`px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-wait' : 'hover:bg-emerald-700'}`}
          >
            <Plus size={18} /> {isSubmitting ? 'Scheduling...' : 'Generate Link & Schedule'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderMeetingLinks = (platform: 'Google Meet' | 'Zoom') => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{platform} Links</h2>
        <button 
          onClick={async () => {
            const newLink = platform === 'Google Meet' 
              ? `meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}` 
              : `zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
            
            try {
              await navigator.clipboard.writeText(`https://${newLink}`);
              await axios.post('/api/meetings', {
                course: 'Persistent Room',
                type: 'General',
                link: newLink,
                platform: platform,
                date: new Date().toISOString().split('T')[0],
                startTime: '00:00',
                duration: '24h'
              });
              await fetchMeetings();
              alert(`A new persistent ${platform} link has been generated and copied to your clipboard!`);
            } catch (error) {
              console.error('Failed to generate link', error);
              alert('Failed to generate persistent link');
            }
          }}
          className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Generate Persistent Link
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scheduledMeetings.filter(m => m.platform === platform).length === 0 ? (
          <div className="col-span-1 lg:col-span-2 text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-medium">No scheduled meetings for {platform}.</p>
          </div>
        ) : scheduledMeetings
            .filter(meeting => meeting.platform === platform)
            .map((meeting, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:border-emerald-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                ${meeting.type === 'Lecture' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                {meeting.type || 'Meeting'}
              </span>
              {meeting.active && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ACTIVE
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-6">{meeting.course}</h3>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <LinkIcon size={18} className="text-slate-400 shrink-0" />
                <span className="text-sm font-medium text-slate-700 truncate">{meeting.link}</span>
              </div>
              <button className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors shrink-0">
                <Copy size={16} />
              </button>
            </div>

            <div className="mt-auto flex gap-3">
              <button 
                onClick={async () => {
                  if (confirm('Are you sure you want to cancel this meeting?')) {
                    try {
                      await axios.delete(`/api/meetings?id=${meeting.id}`);
                      fetchMeetings();
                    } catch (e) {
                      console.error(e);
                      alert('Failed to cancel meeting.');
                    }
                  }
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-white border border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => alert(`Starting ${platform} meeting for ${meeting.course}... Redirecting you to ${meeting.link}`)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              >
                Start
              </button>
            </div>
          </div>
        ))}
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
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage virtual classrooms.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'meetings-schedule':
      return renderScheduleOnlineClass();
    case 'meetings-google':
      return renderMeetingLinks('Google Meet');
    case 'meetings-zoom':
      return renderMeetingLinks('Zoom');
    default:
      return renderPlaceholder('Meetings Management', Video);
  }
}
