import React, { useState } from "react";
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
  User,
  ChevronDown,
  Box,
} from "lucide-react";

// Standalone Maintenance screen for TransitOps.
// Left column is a controlled form that appends to the right column's log,
// simulating POST /api/maintenance followed by a re-fetch of the log list.
export default function MaintenancePage() {
  // Vehicles eligible to be logged against - mirrors GET /api/vehicles?status=Available,In Shop
  const vehicleOptions = ["VAN-05", "TRUCK-11", "MINI-01"];
  const statusOptions = ["Available", "In Shop"];

  // Mock service log rows, shaped like GET /api/maintenance/log.
  const [serviceLog, setServiceLog] = useState([
    { id: 1, vehicle: "VAN-05", service: "Oil Change", cost: 2500, status: "In Shop" },
    { id: 2, vehicle: "TRUCK-11", service: "Engine Repair", cost: 18000, status: "Completed" },
    { id: 3, vehicle: "MINI-01", service: "Tyre Replace", cost: 6200, status: "In Shop" },
  ]);

  // Form state for the "Log Service Record" panel.
  // Note: the source design shows two identical "Date" fields (likely
  // service-start / service-end); kept both for fidelity, labeled distinctly
  // here so the form stays usable.
  const todayISO = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    vehicle: vehicleOptions[0],
    serviceType: "",
    cost: "",
    dateIn: todayISO,
    dateOut: todayISO,
    status: "In Shop",
  });

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.serviceType || !form.cost) return;
    const newEntry = {
      id: Date.now(),
      vehicle: form.vehicle,
      service: form.serviceType,
      cost: Number(form.cost),
      status: form.status,
    };
    // Optimistically prepend, the way the UI would update after the
    // FastAPI call resolves and the log is re-fetched.
    setServiceLog((log) => [newEntry, ...log]);
    setForm((f) => ({ ...f, serviceType: "", cost: "" }));
  };

  const statusStyles = {
    "In Shop": "bg-amber-100 text-amber-700",
    Completed: "bg-green-100 text-green-700",
    Available: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-8 flex-1 w-full bg-white text-slate-900 h-full">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Maintenance</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Log Service Record form */}
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Log Service Record
              </h2>
              <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-sm">
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Vehicle</label>
                  <div className="relative">
                    <select
                      value={form.vehicle}
                      onChange={updateField("vehicle")}
                      className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      {vehicleOptions.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Service Type</label>
                  <input
                    type="text"
                    value={form.serviceType}
                    onChange={updateField("serviceType")}
                    placeholder="e.g. Oil Change"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5">Cost</label>
                    <input
                      type="number"
                      min="0"
                      value={form.cost}
                      onChange={updateField("cost")}
                      placeholder="0"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5">Date In</label>
                    <input
                      type="date"
                      value={form.dateIn}
                      onChange={updateField("dateIn")}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Date Out</label>
                  <input
                    type="date"
                    value={form.dateOut}
                    onChange={updateField("dateOut")}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Status</label>
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={updateField("status")}
                      className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-8 text-sm bg-amber-50 text-amber-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-amber-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium py-3 rounded-lg shadow-sm transition-colors mt-1"
                >
                  Save
                </button>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Available -&gt; In Shop, In Shop -&gt; Available.
                  <br />
                  Note: In Shop vehicles are removed from the dispatch pool.
                </p>
              </form>
            </div>

            {/* Service Log table */}
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Service Log
              </h2>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                      <th className="text-left font-medium px-5 py-3">Vehicle</th>
                      <th className="text-left font-medium px-5 py-3">Service</th>
                      <th className="text-left font-medium px-5 py-3">Cost</th>
                      <th className="text-left font-medium px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceLog.map((row, i) => (
                      <tr
                        key={row.id}
                        className={`border-t border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                      >
                        <td className="px-5 py-3.5 font-medium text-slate-900">{row.vehicle}</td>
                        <td className="px-5 py-3.5 text-slate-700">{row.service}</td>
                        <td className="px-5 py-3.5 text-slate-500">{row.cost.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              statusStyles[row.status] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
    </div>
  );
}
