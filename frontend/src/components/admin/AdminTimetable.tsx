import { useState, useEffect } from 'react';
import { Search, Plus, Clock, Edit2, MapPin, Trash2, X, Edit } from 'lucide-react';

export default function AdminTimetable({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Timetable State
  const [entries, setEntries] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    day: 'Monday', time: '', subject: '', faculty: '', room: '', course: ''
  });

  // Classroom State
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [editingClassroomId, setEditingClassroomId] = useState<string | null>(null);
  const [classroomForm, setClassroomForm] = useState({
    room: '', type: 'Lecture Hall', capacity: 60, building: 'Block A', status: 'Available'
  });

  const [loading, setLoading] = useState(false);

  // Fetching
  const fetchEntries = () => {
    fetch('/api/timetable').then(res => res.json()).then(data => setEntries(Array.isArray(data) ? data : [])).catch(console.error);
  };
  const fetchClassrooms = () => {
    fetch('/api/classrooms').then(res => res.json()).then(data => setClassrooms(Array.isArray(data) ? data : [])).catch(console.error);
  };

  useEffect(() => { 
    if (activeTab === 'timetable-schedule') fetchEntries(); 
    if (activeTab === 'timetable-allocation') fetchClassrooms();
  }, [activeTab]);

  // Timetable Handlers
  const deleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    await fetch(`/api/timetable?id=${id}`, { method: 'DELETE' });
    fetchEntries();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `/api/timetable?id=${editingId}` : '/api/timetable';
      const method = editingId ? 'PUT' : 'POST';
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setShowModal(false);
      fetchEntries();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ day: 'Monday', time: '', subject: '', faculty: '', room: '', course: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (entry: any) => {
    setForm({ day: entry.day, time: entry.time, subject: entry.subject, faculty: entry.faculty, room: entry.room, course: entry.course });
    setEditingId(entry.id);
    setShowModal(true);
  };

  // Classroom Handlers
  const deleteClassroom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this classroom?")) return;
    await fetch(`/api/classrooms?id=${id}`, { method: 'DELETE' });
    fetchClassrooms();
  };

  const handleSaveClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingClassroomId ? `/api/classrooms?id=${editingClassroomId}` : '/api/classrooms';
      const method = editingClassroomId ? 'PUT' : 'POST';
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(classroomForm) });
      setShowClassroomModal(false);
      fetchClassrooms();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddClassroomModal = () => {
    setClassroomForm({ room: '', type: 'Lecture Hall', capacity: 60, building: 'Block A', status: 'Available' });
    setEditingClassroomId(null);
    setShowClassroomModal(true);
  };

  const openEditClassroomModal = (room: any) => {
    setClassroomForm({ room: room.room, type: room.type, capacity: room.capacity, building: room.building, status: room.status });
    setEditingClassroomId(room.id);
    setShowClassroomModal(true);
  };

  const renderSchedule = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Class Timetable</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage weekly class schedules for all programs.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Schedule
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by subject, faculty or room..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 text-sm"
            />
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">No Timetable Entries Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Add class schedules using the button above to populate the timetable.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Day</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Faculty</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Course</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {entries.filter(e => e.subject.toLowerCase().includes(searchTerm.toLowerCase()) || e.faculty.toLowerCase().includes(searchTerm.toLowerCase())).map((entry, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">{entry.day}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-sm">{entry.time}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{entry.subject}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{entry.faculty}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{entry.room}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{entry.course}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(entry)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Schedule' : 'Add New Schedule'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Day</label>
                    <select required value={form.day} onChange={e => setForm({...form, day: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                    <input type="text" required placeholder="e.g. 09:00 AM - 10:30 AM" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Faculty</label>
                  <input type="text" required value={form.faculty} onChange={e => setForm({...form, faculty: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
                    <input type="text" required value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                    <input type="text" required value={form.course} onChange={e => setForm({...form, course: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md">{loading ? 'Saving...' : 'Save Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Classroom Allocation</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage physical space and lab assignments.</p>
        </div>
        <button onClick={openAddClassroomModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Classroom
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <MapPin className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p>No classrooms found. Create one to get started!</p>
          </div>
        ) : (
          classrooms.map((room, i) => (
            <div key={room.id || i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
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
                <button onClick={() => openEditClassroomModal(room)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteClassroom(room.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showClassroomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingClassroomId ? 'Edit Classroom' : 'Add New Classroom'}
              </h3>
              <button onClick={() => setShowClassroomModal(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveClassroom} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Name</label>
                  <input type="text" required placeholder="e.g. Room 101" value={classroomForm.room} onChange={e => setClassroomForm({...classroomForm, room: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                    <select required value={classroomForm.type} onChange={e => setClassroomForm({...classroomForm, type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                      <option value="Lecture Hall">Lecture Hall</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Computer Lab">Computer Lab</option>
                      <option value="Science Lab">Science Lab</option>
                      <option value="Auditorium">Auditorium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacity</label>
                    <input type="number" required min="1" value={classroomForm.capacity} onChange={e => setClassroomForm({...classroomForm, capacity: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Building</label>
                  <input type="text" required placeholder="e.g. Block A" value={classroomForm.building} onChange={e => setClassroomForm({...classroomForm, building: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select required value={classroomForm.status} onChange={e => setClassroomForm({...classroomForm, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowClassroomModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md">{loading ? 'Saving...' : 'Save Classroom'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
