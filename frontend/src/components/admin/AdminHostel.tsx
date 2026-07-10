import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Home, UserCheck, Edit, Trash2 } from 'lucide-react';

export default function AdminHostel({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [editRoomId, setEditRoomId] = useState<string | null>(null);
  const [editAllocationId, setEditAllocationId] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState({ roomNumber: '', block: '', roomType: 'AC', totalBeds: '', status: 'Available' });
  const [allocationForm, setAllocationForm] = useState({ studentId: '', roomId: '', status: 'Allocated' });
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/hostel/rooms');
      if (res.ok) setRooms(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchAllocations = async () => {
    try {
      const res = await fetch('/api/hostel/allocations');
      if (res.ok) setAllocations(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchRooms();
    fetchAllocations();
    fetch('/api/students').then(res => res.json()).then(data => setStudents(data)).catch(console.error);
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/hostel/rooms', {
        method: editRoomId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...roomForm, id: editRoomId })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert("Error saving room: " + (data.error || 'Server error.'));
        return;
      }
      setShowRoomModal(false);
      setEditRoomId(null);
      setRoomForm({ roomNumber: '', block: '', roomType: 'AC', totalBeds: '', status: 'Available' });
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room? All allocations will be removed.')) return;
    try {
      const response = await fetch(`/api/hostel/rooms?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete room');
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert('Error deleting room');
    }
  };

  const handleAllocateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/hostel/allocations', {
        method: editAllocationId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...allocationForm, id: editAllocationId })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert("Error allocating room: " + (data.error || 'Server error.'));
        return;
      }
      setShowAllocationModal(false);
      setEditAllocationId(null);
      setAllocationForm({ studentId: '', roomId: '', status: 'Allocated' });
      fetchAllocations();
      fetchRooms(); // refresh occupancy
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this allocation?')) return;
    try {
      const response = await fetch(`/api/hostel/allocations?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete allocation');
      fetchAllocations();
      fetchRooms(); // refresh occupancy
    } catch (err) {
      console.error(err);
      alert('Error deleting allocation');
    }
  };

  const renderRooms = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hostel Rooms Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage hostel blocks, room types, and availability.</p>
        </div>
        <button onClick={() => { setEditRoomId(null); setRoomForm({ roomNumber: '', block: '', roomType: 'AC', totalBeds: '', status: 'Available' }); setShowRoomModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by room number or block..." 
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Room Details</th>
                <th className="p-4">Block / Hostel</th>
                <th className="p-4">Room Type</th>
                <th className="p-4">Beds Available</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rooms.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Home size={20} />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Room {item.room}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{item.block}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{item.type}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{item.total - (item.occ || 0)}</span>
                      <span className="text-xs text-slate-500">/ {item.total} free</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      item.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                      item.status === 'Partially Available' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {
                        setEditRoomId(item.id);
                        setRoomForm({
                          roomNumber: item.room,
                          block: item.block,
                          roomType: item.type,
                          totalBeds: item.total.toString(),
                          status: item.status
                        });
                        setShowRoomModal(true);
                      }} className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteRoom(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Room Allocation</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Assign and manage student hostel accommodations.</p>
        </div>
        <button onClick={() => {
          setEditAllocationId(null);
          setAllocationForm({ studentId: '', roomId: '', status: 'Allocated' });
          setShowAllocationModal(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <UserCheck size={18} /> Allocate Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allocations.map((alloc, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                alloc.status === 'Allocated' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' : 
                'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800'
              }`}>
                {alloc.status}
              </span>
              <div className="flex gap-2">
                <button onClick={() => {
                  setEditAllocationId(alloc.id);
                  setAllocationForm({ studentId: alloc.studentId, roomId: rooms.find(r => r.room === alloc.room)?.id || '', status: alloc.status });
                  setShowAllocationModal(true);
                }} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteAllocation(alloc.id)} className="text-slate-400 hover:text-rose-600 transition-colors" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{alloc.student}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">ID: {alloc.studentId.substring(0, 8)}...</p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Assigned Room</p>
              {alloc.status === 'Allocated' ? (
                <p className="font-bold text-slate-700 dark:text-slate-300">{alloc.room} <span className="font-normal text-slate-500">({alloc.block})</span></p>
              ) : (
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Review Application &rarr;</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAllocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editAllocationId ? 'Edit Allocation' : 'Allocate Room to Student'}</h3>
              <button onClick={() => setShowAllocationModal(false)} className="text-slate-400 hover:text-slate-500">
                <Trash2 className="w-6 h-6 hidden" />
                &times;
              </button>
            </div>
            <form onSubmit={handleAllocateRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student</label>
                <select required value={allocationForm.studentId} onChange={e => setAllocationForm({...allocationForm, studentId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <option value="">Select Student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
                <select required value={allocationForm.roomId} onChange={e => setAllocationForm({...allocationForm, roomId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <option value="">Select Room...</option>
                  {rooms.filter(r => (r.total - (r.occ || 0)) > 0).map(r => (
                    <option key={r.id} value={r.id}>Room {r.room} (Block {r.block})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select required value={allocationForm.status} onChange={e => setAllocationForm({...allocationForm, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <option>Allocated</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAllocationModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Allocate Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderFees = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hostel Fees & Payments</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track accommodation and mess charges.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Download size={18} /> Export Records
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Room Details</th>
                <th className="p-4">Total Fee</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'James Wilson', room: 'A-101', total: '$1,200', paid: '$1,200', status: 'Cleared' },
                { name: 'Sophia Davis', room: 'B-302', total: '$1,500', paid: '$750', status: 'Partial' },
                { name: 'Ethan Hunt', room: 'C-110', total: '$2,000', paid: '$0', status: 'Pending' },
              ].map((record, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">{record.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{record.room}</td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{record.total}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{record.paid}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      record.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                      record.status === 'Partial' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-lg transition-colors">
                      {record.status === 'Cleared' ? 'View Receipt' : 'Record Pay'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'hostel-rooms':
      return (
        <>
          {renderRooms()}
          {showRoomModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editRoomId ? 'Edit Room' : 'Add New Room'}</h3>
                  <button onClick={() => setShowRoomModal(false)} className="text-slate-400 hover:text-slate-500">
                    <Trash2 className="w-6 h-6 hidden" />
                    &times;
                  </button>
                </div>
                <form onSubmit={handleAddRoom} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Number</label>
                      <input type="text" required value={roomForm.roomNumber} onChange={e => setRoomForm({...roomForm, roomNumber: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Block</label>
                      <input type="text" required value={roomForm.block} onChange={e => setRoomForm({...roomForm, block: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Type</label>
                      <select required value={roomForm.roomType} onChange={e => setRoomForm({...roomForm, roomType: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <option>AC</option>
                        <option>Non-AC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Beds</label>
                      <input type="number" required min="1" value={roomForm.totalBeds} onChange={e => setRoomForm({...roomForm, totalBeds: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select required value={roomForm.status} onChange={e => setRoomForm({...roomForm, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <option>Available</option>
                      <option>Partially Available</option>
                      <option>Full</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowRoomModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                      {loading ? 'Saving...' : 'Save Room'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      );
    case 'hostel-allocation':
      return renderAllocation();
    case 'hostel-fees':
      return renderFees();
    default:
      return renderRooms();
  }
}
