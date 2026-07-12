import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Users, Truck, AlertTriangle, Wrench, BarChart3, Filter, Route } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getVehicles, getDrivers, getTrips } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);

  // Filters
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, dData, tData] = await Promise.all([
          getVehicles(),
          getDrivers(),
          getTrips()
        ]);
        setVehicles(vData || []);
        setDrivers(dData || []);
        setTrips(tData || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  // Dummy Maintenance Data
  const maintenanceData = [
    { id: "MN-101", vehicle: "VAN-05", type: "Van", region: "North", issue: "Engine Oil Leak", status: "In Progress", estCompletion: "2026-07-15" },
    { id: "MN-102", vehicle: "TRUCK-02", type: "Truck", region: "South", issue: "Brake Pad Replacement", status: "Pending Parts", estCompletion: "2026-07-18" },
    { id: "MN-103", vehicle: "MINI-01", type: "Mini", region: "East", issue: "Tire Alignment", status: "Scheduled", estCompletion: "2026-07-13" },
  ];

  // Apply filters to maintenance data for demonstration
  const filteredMaintenance = useMemo(() => {
    return maintenanceData.filter(m => {
      const matchType = typeFilter === "All" || m.type === typeFilter;
      const matchStatus = statusFilter === "All" || m.status === statusFilter;
      const matchRegion = regionFilter === "All" || m.region === regionFilter;
      return matchType && matchStatus && matchRegion;
    });
  }, [typeFilter, statusFilter, regionFilter]);

  // Derived Stats
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === "On Trip").length;
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const maintenanceVehiclesCount = maintenanceData.length; // From dummy data
  const activeTripsCount = trips.filter(t => t.status === "Dispatched").length;
  const driversOnDuty = drivers.filter(d => d.status === "On Trip").length;

  const fleetUtility = totalVehicles > 0
    ? Math.round(((activeVehicles + maintenanceVehiclesCount) / (totalVehicles)) * 100)
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Overview and analytics</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 px-3 border-r border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Filters</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border-none text-sm rounded-lg py-1.5 px-3 outline-none cursor-pointer focus:ring-2 focus:ring-amber-300"
          >
            <option value="All">All Types</option>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
            <option value="Mini">Mini</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border-none text-sm rounded-lg py-1.5 px-3 outline-none cursor-pointer focus:ring-2 focus:ring-amber-300"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Parts">Pending Parts</option>
            <option value="Scheduled">Scheduled</option>
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-50 border-none text-sm rounded-lg py-1.5 px-3 outline-none cursor-pointer focus:ring-2 focus:ring-amber-300"
          >
            <option value="All">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Vehicles</p>
            <h3 className="text-3xl font-bold text-slate-800">{activeVehicles}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Available Vehicles</p>
            <h3 className="text-3xl font-bold text-slate-800">{availableVehicles}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">In Maintenance</p>
            <h3 className="text-3xl font-bold text-slate-800">{maintenanceVehiclesCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Trips</p>
            <h3 className="text-3xl font-bold text-slate-800">{activeTripsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Route className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Drivers on Duty</p>
            <h3 className="text-3xl font-bold text-slate-800">{driversOnDuty}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Fleet Utility</p>
            <h3 className="text-3xl font-bold text-slate-800">{fleetUtility}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Vehicles in Maintenance (Dummy Data)</h2>
          <p className="text-sm text-slate-500">Track vehicles currently undergoing repairs or scheduled maintenance.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type & Region</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Issue</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Est. Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaintenance.length > 0 ? (
                filteredMaintenance.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{m.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{m.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{m.type}</div>
                      <div className="text-xs text-slate-400">{m.region}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{m.issue}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${m.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                          m.status === 'Pending Parts' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{m.estCompletion}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-500">
                    No maintenance records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
