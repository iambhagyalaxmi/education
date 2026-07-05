import { 
  Bell, 
  MonitorSmartphone, 
  Palette,
  Globe,
  Shield
} from 'lucide-react';

export default function FacultySettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell, active: true },
            { id: 'security', label: 'Security & Privacy', icon: Shield, active: false },
            { id: 'appearance', label: 'Appearance', icon: Palette, active: false },
            { id: 'devices', label: 'Active Devices', icon: MonitorSmartphone, active: false },
            { id: 'language', label: 'Language & Region', icon: Globe, active: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                  ${item.active 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon size={18} className={item.active ? 'text-emerald-600' : 'text-slate-400'} />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-emerald-600"/> Notification Preferences
            </h3>
            
            <div className="space-y-6">
              
              <div>
                <h4 className="font-bold text-slate-800 mb-4">Email Notifications</h4>
                <div className="space-y-4">
                  <label className="flex justify-between items-center cursor-pointer group">
                    <div>
                      <span className="block text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Daily Summary</span>
                      <span className="block text-xs text-slate-500 mt-0.5">Receive a daily digest of tasks and classes.</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                  </label>
                  
                  <label className="flex justify-between items-center cursor-pointer group">
                    <div>
                      <span className="block text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Leave Application Updates</span>
                      <span className="block text-xs text-slate-500 mt-0.5">Get notified when your leave status changes.</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              <div>
                <h4 className="font-bold text-slate-800 mb-4">Push Notifications</h4>
                <div className="space-y-4">
                  <label className="flex justify-between items-center cursor-pointer group">
                    <div>
                      <span className="block text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Student Messages</span>
                      <span className="block text-xs text-slate-500 mt-0.5">Instant alerts for new direct messages.</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                  </label>
                  
                  <label className="flex justify-between items-center cursor-pointer group">
                    <div>
                      <span className="block text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Class Reminders</span>
                      <span className="block text-xs text-slate-500 mt-0.5">Alerts 15 minutes before a scheduled class.</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => alert("Settings preferences saved successfully!")}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
