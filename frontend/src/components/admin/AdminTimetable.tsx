import { useState } from 'react';
import { Search, Filter, Plus, Clock, Edit, Calendar, MapPin } from 'lucide-react';

export default function AdminTimetable({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderSchedule = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Class Timetable</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage weekly class schedules for all programs.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Calendar size={18} /> Generate Timetable
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by program, semester or faculty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Weekly Schedule View</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">Select a program and semester from the filter to view the detailed day-by-day timetable.</p>
          <div className="flex justify-center gap-3">
            <select className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 font-medium">
              <option>B.Tech Computer Science</option>
              <option>B.Tech Information Tech</option>
              <option>BBA</option>
            </select>
            <select className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 font-medium">
              <option>Semester 1</option>
              <option>Semester 3</option>
              <option>Semester 5</option>
            </select>
            <button className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium transition-colors">
              View Timetable
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Classroom Allocation</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage physical space and lab assignments.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Classroom
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { room: 'Room 101', type: 'Lecture Hall', capacity: 120, building: 'Block A', status: 'Available' },
          { room: 'CS Lab 1', type: 'Computer Lab', capacity: 40, building: 'Block B', status: 'Occupied' },
          { room: 'Room 205', type: 'Classroom', capacity: 60, building: 'Block A', status: 'Available' },
          { room: 'Physics Lab', type: 'Science Lab', capacity: 30, building: 'Block C', status: 'Maintenance' },
          { room: 'Seminar Hall', type: 'Auditorium', capacity: 250, building: 'Main Block', status: 'Available' },
        ].map((room, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-indigo-500" />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{room.room}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                room.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                room.status === 'Occupied' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {room.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
              <p>Type: <span className="font-semibold text-slate-700 dark:text-slate-300">{room.type}</span></p>
              <p>Building: <span className="font-semibold text-slate-700 dark:text-slate-300">{room.building}</span></p>
              <p>Capacity: <span className="font-semibold text-slate-700 dark:text-slate-300">{room.capacity} Students</span></p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                <Edit size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'timetable-schedule':
      return renderSchedule();
    case 'timetable-allocation':
      return renderAllocation();
    default:
      return renderSchedule();
  }
}
