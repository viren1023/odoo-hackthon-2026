import React, { useState, useMemo } from "react";
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
} from "lucide-react";

// Standalone Vehicle Registry ("Fleet") screen for TransitOps.
// Includes the full app shell (sidebar + topbar) since this page is always
// viewed inside that frame, plus the registry table itself.
export default function VehicleRegistryPage() {
  // Mock rows shaped like what GET /api/vehicles would return from FastAPI.
  const [vehicles] = useState([
    { id: 1, regNo: "GJ01AB1452", name: "VAN-05", type: "Van", capacity: "500 kg", odometer: 74000, acqCost: 620000, status: "Available" },
    { id: 2, regNo: "GJ01AB1448", name: "TRUCK-11", type: "Truck", capacity: "5 Ton", odometer: 182000, acqCost: 2450000, status: "On Trip" },
    { id: 3, regNo: "GJ01AB1120", name: "MINI-01", type: "Mini", capacity: "1 Ton", odometer: 66000, acqCost: 410000, status: "In Shop" },
    { id: 4, regNo: "GJ01AB008", name: "VAN-09", type: "Van", capacity: "750 kg", odometer: 241900, acqCost: 590000, status: "Retired" },
  ]);

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

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Fleet", icon: Truck, active: true },
    { label: "Drivers", icon: Users },
    { label: "Trips", icon: Route },
    { label: "Maintenance", icon: Wrench },
    { label: "Fuel & Expenses", icon: Fuel },
    { label: "Analytics", icon: BarChart3 },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full bg-white flex text-slate-900">
      {/* Sidebar - fixed width, full height, simple icon+label nav */}
      <aside className="w-56 border-r border-slate-200 flex flex-col p-5 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-1">
          <Box className="w-5 h-5 text-slate-900" strokeWidth={1.75} />
          <span className="text-lg font-bold">TransitOps</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                active
                  ? "bg-amber-50 text-slate-900 font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-6 px-8 py-4 border-b border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-slate-900">Raven K.</p>
              <p className="text-xs text-slate-500">Dispatcher</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8 flex-1 overflow-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">2. Vehicle Registry</h1>

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

            <button className="ml-auto flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-4 py-2 rounded-lg shadow-sm transition-colors">
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
                    <td className="px-5 py-3.5 text-slate-500">{v.capacity}</td>
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
        </main>
      </div>
    </div>
  );
}
