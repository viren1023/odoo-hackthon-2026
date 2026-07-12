import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getMaintenance, registerMaintenance, updateMaintenanceStatus, getVehicles } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MaintenancePage() {
  const { user } = useAuth();
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [serviceLog, setServiceLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = ["Active", "Completed"];

  const todayISO = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    vehicle: "",
    serviceType: "",
    cost: "",
    dateIn: todayISO,
  });

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const uid = user?.id || 1;
      const [maintenanceData, vehicleData] = await Promise.all([
        getMaintenance(uid),
        getVehicles(uid)
      ]);
      
      setServiceLog(maintenanceData || []);
      
      if (vehicleData) {
        // Only allow logging maintenance for available or already in-shop vehicles
        const eligibleVehicles = vehicleData.filter(v => v.status === "Available" || v.status === "In Shop");
        setVehicleOptions(eligibleVehicles);
        
        if (eligibleVehicles.length > 0 && !form.vehicle) {
          setForm(prev => ({ ...prev, vehicle: eligibleVehicles[0].license_plate }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch maintenance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.serviceType || !form.cost || !form.vehicle) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        license_plate: form.vehicle,
        service_name: form.serviceType,
        cost: Number(form.cost),
        service_date: form.dateIn,
      };
      
      await registerMaintenance(payload);
      
      // Refresh the log and vehicles (since vehicle status might have been changed by a DB trigger, though currently backend doesn't update vehicle status on maintenance add, it's good practice)
      await fetchInitialData();
      
      setForm((f) => ({ ...f, serviceType: "", cost: "" }));
    } catch (err) {
      console.error("Failed to log maintenance", err);
      alert(err.response?.data?.msg || "Failed to log maintenance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMaintenanceStatus({ id, status: newStatus });
      // Refresh the log
      const uid = user?.id || 1;
      const updatedLogs = await getMaintenance(uid);
      setServiceLog(updatedLogs || []);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const statusStyles = {
    "Active": "bg-amber-100 text-amber-700",
    "Completed": "bg-green-100 text-green-700",
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
              <label className="block text-sm text-slate-700 mb-1.5">Vehicle (License Plate)</label>
              <div className="relative">
                <select
                  value={form.vehicle}
                  onChange={updateField("vehicle")}
                  className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  disabled={isLoading}
                >
                  <option value="" disabled>Select a vehicle</option>
                  {vehicleOptions.map((v) => (
                    <option key={v.id} value={v.license_plate}>
                      {v.license_plate} - {v.Vname}
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
                placeholder="e.g. Engine Oil Leak"
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
                <label className="block text-sm text-slate-700 mb-1.5">Service Date</label>
                <input
                  type="date"
                  value={form.dateIn}
                  onChange={updateField("dateIn")}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-medium py-3 rounded-lg shadow-sm transition-colors mt-1"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
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
                  <th className="text-left font-medium px-5 py-3">Date</th>
                  <th className="text-left font-medium px-5 py-3">Cost</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-slate-500">Loading records...</td>
                  </tr>
                ) : serviceLog.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-slate-500">No maintenance records found.</td>
                  </tr>
                ) : (
                  serviceLog.map((row, i) => (
                    <tr
                      key={row.id}
                      className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-900">{row.license_plate}</td>
                      <td className="px-5 py-3.5 text-slate-700">{row.service_name}</td>
                      <td className="px-5 py-3.5 text-slate-500">{new Date(row.service_date).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 text-slate-500">₹{Number(row.cost).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={row.status}
                          onChange={(e) => handleStatusChange(row.id, e.target.value)}
                          disabled={row.status === "Completed"}
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border-none outline-none appearance-none ${
                            row.status === "Completed" ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                          } ${statusStyles[row.status] || "bg-slate-100 text-slate-600"}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
