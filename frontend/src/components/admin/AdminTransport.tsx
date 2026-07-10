import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Map, Truck, UserCircle, Edit, Trash2 } from 'lucide-react';

export default function AdminTransport({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editRouteId, setEditRouteId] = useState<string | null>(null);
  const [routeForm, setRouteForm] = useState({ routeNo: '', name: '', path: '', vehicleId: '', stops: '' });
  
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ vehicleId: '', type: 'Bus', plateNumber: '', condition: 'Good', status: 'Active' });

  const [drivers, setDrivers] = useState<any[]>([]);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [editDriverId, setEditDriverId] = useState<string | null>(null);
  const [driverForm, setDriverForm] = useState({ name: '', license: '', vehicle: '', route: '' });

  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/transport/routes');
      if (res.ok) setRoutes(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/transport/vehicles');
      if (res.ok) setVehicles(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/transport/drivers');
      if (res.ok) setDrivers(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchRoutes();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/transport/routes', {
        method: editRouteId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...routeForm, id: editRouteId })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert("Error saving route: " + (data.error || 'Server error.'));
        return;
      }
      setShowRouteModal(false);
      setEditRouteId(null);
      setRouteForm({ routeNo: '', name: '', path: '', vehicleId: '', stops: '' });
      fetchRoutes();
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    try {
      const response = await fetch(`/api/transport/routes?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete route');
      fetchRoutes();
    } catch (err) {
      console.error(err);
      alert('Error deleting route');
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/transport/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert("Error saving vehicle: " + (data.error || 'Server error.'));
        return;
      }
      setShowVehicleModal(false);
      setVehicleForm({ vehicleId: '', type: 'Bus', plateNumber: '', condition: 'Good', status: 'Active' });
      fetchVehicles();
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/transport/drivers', {
        method: editDriverId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...driverForm, id: editDriverId })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert("Error saving driver: " + (data.error || 'Server error.'));
        return;
      }
      setShowDriverModal(false);
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    try {
      const response = await fetch(`/api/transport/drivers?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchDrivers();
    } catch (err) {
      console.error(err);
      alert('Error deleting driver');
    }
  };

  const renderRoutes = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Bus Routes</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage institutional transport routes and stops.</p>
        </div>
        <button onClick={() => {
          setEditRouteId(null);
          setRouteForm({ routeNo: '', name: '', path: '', vehicleId: '', stops: '' });
          setShowRouteModal(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
              {routes.map((route, i) => (
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
                      <button onClick={() => {
                        setEditRouteId(route.id);
                        setRouteForm({
                          routeNo: route.no,
                          name: route.name,
                          path: route.path,
                          vehicleId: vehicles.find(v => v.id === route.vehicle)?.id || '',
                          stops: route.stops.toString()
                        });
                        setShowRouteModal(true);
                      }} className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteRoute(route.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Delete">
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

      {showRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editRouteId ? 'Edit Route' : 'Add New Route'}</h3>
              <button onClick={() => setShowRouteModal(false)} className="text-slate-400 hover:text-slate-500">
                <Trash2 className="w-6 h-6 hidden" />
                &times;
              </button>
            </div>
            <form onSubmit={handleAddRoute} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Route No.</label>
                  <input required type="text" value={routeForm.routeNo} onChange={e => setRouteForm({...routeForm, routeNo: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. 101" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Route Name</label>
                  <input required type="text" value={routeForm.name} onChange={e => setRouteForm({...routeForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. City Center Express" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Path (Origin - Destination)</label>
                <input required type="text" value={routeForm.path} onChange={e => setRouteForm({...routeForm, path: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. Campus - Downtown" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Stops</label>
                  <input required type="number" value={routeForm.stops} onChange={e => setRouteForm({...routeForm, stops: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Vehicle</label>
                  <select value={routeForm.vehicleId} onChange={e => setRouteForm({...routeForm, vehicleId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <option value="">Unassigned</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.plate} ({v.type})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowRouteModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderVehicles = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Vehicle Fleet</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage institutional buses and transport vehicles.</p>
        </div>
        <button onClick={() => {
          setVehicleForm({ vehicleId: '', type: 'Bus', plateNumber: '', condition: 'Good', status: 'Active' });
          setShowVehicleModal(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle, i) => (
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

      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Vehicle</h3>
              <button onClick={() => setShowVehicleModal(false)} className="text-slate-400 hover:text-slate-500">
                &times;
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle ID</label>
                  <input required type="text" value={vehicleForm.vehicleId} onChange={e => setVehicleForm({...vehicleForm, vehicleId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. BUS-101" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">License Plate</label>
                  <input required type="text" value={vehicleForm.plateNumber} onChange={e => setVehicleForm({...vehicleForm, plateNumber: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. ABC-1234" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select value={vehicleForm.type} onChange={e => setVehicleForm({...vehicleForm, type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <option value="Bus">Bus</option>
                    <option value="Van">Van</option>
                    <option value="Car">Car</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Condition</label>
                  <select value={vehicleForm.condition} onChange={e => setVehicleForm({...vehicleForm, condition: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Maintenance">Needs Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowVehicleModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderDrivers = () => (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Driver Details</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage transport staff, licenses, and route assignments.</p>
        </div>
        <button onClick={() => {
          setEditDriverId(null);
          setDriverForm({ name: '', license: '', vehicle: '', route: '' });
          setShowDriverModal(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
              {drivers.map((driver, i) => (
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
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {
                        setEditDriverId(driver.id);
                        setDriverForm({
                          name: driver.name,
                          license: driver.license,
                          vehicle: driver.vehicle,
                          route: driver.route
                        });
                        setShowDriverModal(true);
                      }} className="p-1.5 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteDriver(driver.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-colors" title="Delete">
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

      {showDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editDriverId ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button onClick={() => setShowDriverModal(false)} className="text-slate-400 hover:text-slate-500">
                &times;
              </button>
            </div>
            <form onSubmit={handleAddDriver} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Driver Name</label>
                <input required type="text" value={driverForm.name} onChange={e => setDriverForm({...driverForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">License No.</label>
                <input required type="text" value={driverForm.license} onChange={e => setDriverForm({...driverForm, license: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg" placeholder="e.g. DL-12345678" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Vehicle</label>
                  <select value={driverForm.vehicle} onChange={e => setDriverForm({...driverForm, vehicle: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <option value="Unassigned">Unassigned</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Route</label>
                  <select value={driverForm.route} onChange={e => setDriverForm({...driverForm, route: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <option value="Unassigned">Unassigned</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.no}>Route {r.no}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowDriverModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
