import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Search,
  Plus,
  User,
  ChevronDown,
  Box,
  X,
  AlertCircle,
} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { registerVehicle, getVehicles } from '../services/api';

// Standalone Vehicle Registry ("Fleet") screen for TransitOps.
// Includes the full app shell (sidebar + topbar) since this page is always
// viewed inside that frame, plus the registry table itself.
export default function VehicleRegistryPage() {
  const { user } = useAuth();
  
  // Vehicles state to hold registered fleet.
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const uid = user?.id || 1;
        const data = await getVehicles(uid);
        const formattedData = data.map(v => ({
          id: v.id,
          regNo: v.license_plate,
          name: v.Vname,
          type: v.type,
          capacity: v.capacity,
          odometer: v.odometer,
          acqCost: v.acquisition_cost,
          status: v.status
        }));
        setVehicles(formattedData);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      }
    };
    fetchVehicles();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ Vname: '', license_plate: '', type: 'Van', capacity: '', odometer: '', acqCost: '', status: 'Available' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Filter state - all derived client-side from the mock array, mirroring
  // how query params (?type=&status=&q=) would be applied server-side.
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  const types = useMemo(() => ["All", ...new Set(vehicles.map((v) => v.type))], [vehicles]);
  const statuses = useMemo(() => ["All", ...new Set(vehicles.map((v) => v.status))], [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesType = typeFilter === "All" || v.type === typeFilter;
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      const matchesQuery = v.regNo.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesStatus && matchesQuery;
    });
  }, [vehicles, typeFilter, statusFilter, query]);

  // Indian-style digit grouping (6,20,000) to match the source cost figures.
  const formatCost = (n) => {
    const s = String(n);
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return rest ? `${grouped},${last3}` : last3;
  };

  const statusStyles = {
    Available: "bg-green-100 text-green-700",
    "On Trip": "bg-blue-100 text-blue-700",
    "In Shop": "bg-amber-100 text-amber-700",
    Retired: "bg-red-100 text-red-700",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await registerVehicle({ ...formData, uid: user.id || 1, capacity: Number(formData.capacity), odometer: Number(formData.odometer), acquisition_cost: Number(formData.acqCost) });
      setVehicles([...vehicles, { id: Date.now(), regNo: formData.license_plate, name: formData.Vname, type: formData.type, capacity: Number(formData.capacity), odometer: Number(formData.odometer), acqCost: Number(formData.acqCost), status: formData.status }]);
      setIsModalOpen(false);
      setFormData({ Vname: '', license_plate: '', type: 'Van', capacity: '', odometer: '', acqCost: '', status: 'Available' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Error registering vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex-1 w-full bg-white text-slate-900 h-full">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Vehicle Registry</h1>

          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    Type: {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reg no..."
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 w-56"
            />

            <button 
              onClick={() => { setIsModalOpen(true); setError(''); }}
              className="ml-auto flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>

          {/* Registry table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium px-5 py-3">Reg. No. Unique</th>
                  <th className="text-left font-medium px-5 py-3">Name/Model</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-left font-medium px-5 py-3">Capacity</th>
                  <th className="text-left font-medium px-5 py-3">Odometer</th>
                  <th className="text-left font-medium px-5 py-3">Acq. Cost</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((v, i) => (
                  <tr
                    key={v.id}
                    className={`border-t border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-900">{v.regNo}</td>
                    <td className="px-5 py-3.5 text-slate-700">{v.name}</td>
                    <td className="px-5 py-3.5 text-slate-500">{v.type}</td>
                    <td className="px-5 py-3.5 text-slate-500">{v.capacity >= 1000 ? (v.capacity/1000) + ' Ton' : v.capacity + ' kg'}</td>
                    <td className="px-5 py-3.5 text-slate-500">{v.odometer.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatCost(v.acqCost)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[v.status]}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-sm">
                      No vehicles match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Rule: Registration No. must be unique. Retired/In Shop vehicles are hidden from Trip Dispatcher.
          </p>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add New Vehicle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">License Plate (Reg No.)</label>
                <input required value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none transition-shadow" placeholder="e.g. GJ01AB1234" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Name/Model</label>
                <input required value={formData.Vname} onChange={e => setFormData({...formData, Vname: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none transition-shadow" placeholder="e.g. VAN-05" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none bg-white transition-shadow">
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Mini">Mini</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (kg)</label>
                  <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none transition-shadow" placeholder="e.g. 1000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Odometer</label>
                  <input required type="number" min="0" value={formData.odometer} onChange={e => setFormData({...formData, odometer: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none transition-shadow" placeholder="e.g. 15000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Cost</label>
                  <input required type="number" min="0" value={formData.acqCost} onChange={e => setFormData({...formData, acqCost: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none transition-shadow" placeholder="e.g. 620000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none bg-white transition-shadow">
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium disabled:opacity-50 transition-colors shadow-sm">
                  {isSubmitting ? 'Saving...' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
