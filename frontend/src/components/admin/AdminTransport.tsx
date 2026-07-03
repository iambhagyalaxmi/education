import { useState } from 'react';
import { Search, Filter, Plus, Map, Truck, UserCircle, Edit, Trash2 } from 'lucide-react';

export default function AdminTransport({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderRoutes = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Bus Routes</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage institutional transport routes and stops.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Route
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search routes..." 
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
                <th className="p-4 pl-6">Route Number & Name</th>
                <th className="p-4">Origin - Destination</th>
                <th className="p-4">Assigned Vehicle</th>
                <th className="p-4">Total Stops</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { no: 'R-01', name: 'Downtown Express', path: 'City Center ↔ Campus', vehicle: 'BUS-1042', stops: 12 },
                { no: 'R-02', name: 'North Suburbs', path: 'North Hills ↔ Campus', vehicle: 'BUS-2055', stops: 15 },
                { no: 'R-03', name: 'East Side Shuttle', path: 'East Station ↔ Campus', vehicle: 'BUS-3108', stops: 8 },
              ].map((route, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Map size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{route.no}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{route.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{route.path}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{route.vehicle}</td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{route.stops}</td>
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

  const renderVehicles = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Vehicle Fleet Fleet</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage institutional buses and transport vehicles.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'BUS-1042', type: '50-Seater Bus', plate: 'CA-12-8899', condition: 'Excellent', status: 'Active' },
          { id: 'BUS-2055', type: '50-Seater Bus', plate: 'CA-12-3344', condition: 'Good', status: 'Active' },
          { id: 'VAN-4011', type: '15-Seater Van', plate: 'CA-05-1122', condition: 'Needs Service', status: 'Maintenance' },
        ].map((vehicle, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Truck size={24} />
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                vehicle.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' : 
                'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:border-rose-800'
              }`}>
                {vehicle.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{vehicle.id}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{vehicle.type}</p>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">License Plate</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{vehicle.plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Condition</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle.condition}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDrivers = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Driver Details</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage transport staff, licenses, and route assignments.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Driver
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Driver Name</th>
                <th className="p-4">License No.</th>
                <th className="p-4">Assigned Vehicle</th>
                <th className="p-4">Assigned Route</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Robert Johnson', license: 'DL-98765432', vehicle: 'BUS-1042', route: 'R-01 (Downtown Express)' },
                { name: 'William Smith', license: 'DL-12345678', vehicle: 'BUS-2055', route: 'R-02 (North Suburbs)' },
                { name: 'David Lee', license: 'DL-55667788', vehicle: 'Unassigned', route: 'Unassigned' },
              ].map((driver, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                        <UserCircle size={20} />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{driver.name}</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600 dark:text-slate-400">{driver.license}</td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{driver.vehicle}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{driver.route}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                      <Edit size={18} />
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
    case 'transport-routes':
      return renderRoutes();
    case 'transport-vehicles':
      return renderVehicles();
    case 'transport-drivers':
      return renderDrivers();
    default:
      return renderRoutes();
  }
}
