import React, { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  User,
  ChevronDown,
  Box,
  Check,
} from "lucide-react";

// Standalone Settings & General screen for TransitOps.
// Same sidebar/topbar shell as the other app pages. Form fields are
// controlled inputs so "Save changes" reflects real, current state -
// this simulates a PATCH /api/settings call against the FastAPI backend.
export default function SettingsPage() {
  // Mock "current settings" payload, shaped like what GET /api/settings
  // would return. Used only to seed the form's initial state.
  const initialSettings = {
    depotName: "Gandhinagar Depot GJ4",
    currency: "INR",
    distanceUnit: "Kilometers",
  };

  const currencyOptions = [
    { value: "INR", label: "INR (₹)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
  ];
  const distanceUnitOptions = ["Kilometers", "Miles"];

  const [settings, setSettings] = useState(initialSettings);
  const [savedState, setSavedState] = useState("idle"); // idle | saving | saved

  // A single field updater keeps every input's onChange one-liner
  // and makes it trivial to add more settings fields later.
  const updateField = (field) => (e) => {
    setSettings((s) => ({ ...s, [field]: e.target.value }));
    setSavedState("idle"); // any edit invalidates the "Saved" confirmation
  };

  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const handleSave = () => {
    setSavedState("saving");
    // Simulate the round trip to the backend.
    setTimeout(() => setSavedState("saved"), 700);
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Fleet", icon: Truck },
    { label: "Drivers", icon: Users },
    { label: "Trips", icon: Route },
    { label: "Maintenance", icon: Wrench },
    { label: "Fuel & Expenses", icon: Fuel },
    { label: "Analytics", icon: BarChart3 },
    { label: "Settings", icon: SettingsIcon, active: true },
  ];

  return (
    <div className="min-h-screen w-full bg-white flex text-slate-900">
      {/* Sidebar */}
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
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings &amp; General</h1>

          {/* Constrain the form column so it doesn't stretch full-width on large screens */}
          <div className="max-w-md">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              General
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">Depot Name</label>
                <input
                  type="text"
                  value={settings.depotName}
                  onChange={updateField("depotName")}
                  className="w-full bg-slate-100 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">Currency</label>
                <div className="relative">
                  <select
                    value={settings.currency}
                    onChange={updateField("currency")}
                    className="appearance-none w-full bg-slate-100 rounded-lg px-4 py-3 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    {currencyOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">Distance Unit</label>
                <div className="relative">
                  <select
                    value={settings.distanceUnit}
                    onChange={updateField("distanceUnit")}
                    className="appearance-none w-full bg-slate-100 rounded-lg px-4 py-3 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    {distanceUnitOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={!isDirty || savedState === "saving"}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mt-1"
              >
                {savedState === "saved" && <Check className="w-4 h-4" />}
                {savedState === "saving" ? "Saving..." : savedState === "saved" ? "Saved" : "Save changes"}
              </button>

              {savedState === "saved" && (
                <p className="text-xs text-green-600 -mt-2">Your changes have been saved.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
