import { useState } from 'react';
import { Search, Filter, Download, Plus, Home, UserCheck, Edit, Trash2 } from 'lucide-react';

export default function AdminHostel({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderRooms = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hostel Rooms Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage hostel blocks, room types, and availability.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
              {[
                { room: 'A-101', block: 'Boys Hostel A', type: '2-Seater (AC)', total: 2, occ: 2, status: 'Full' },
                { room: 'A-102', block: 'Boys Hostel A', type: '2-Seater (AC)', total: 2, occ: 1, status: 'Partially Available' },
                { room: 'B-205', block: 'Girls Hostel B', type: '3-Seater (Non-AC)', total: 3, occ: 0, status: 'Available' },
                { room: 'C-110', block: 'International Block', type: 'Single Room', total: 1, occ: 1, status: 'Full' },
              ].map((item, i) => (
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
                      <span className="font-bold text-slate-700 dark:text-slate-300">{item.total - item.occ}</span>
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
                      <button className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
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
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <UserCheck size={18} /> Allocate Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { student: 'James Wilson', id: 'STD-24-089', room: 'A-101', block: 'Boys Hostel A', status: 'Allocated' },
          { student: 'Sophia Davis', id: 'STD-23-112', room: 'B-302', block: 'Girls Hostel B', status: 'Allocated' },
          { student: 'Michael Brown', id: 'STD-24-205', room: '-', block: '-', status: 'Pending Request' },
        ].map((alloc, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                alloc.status === 'Allocated' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' : 
                'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800'
              }`}>
                {alloc.status}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{alloc.student}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{alloc.id}</p>
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
      return renderRooms();
    case 'hostel-allocation':
      return renderAllocation();
    case 'hostel-fees':
      return renderFees();
    default:
      return renderRooms();
  }
}
