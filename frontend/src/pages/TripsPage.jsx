import React, { useState, useMemo, useEffect } from "react";
import { getAvailableVehicles, getAvailableDrivers, createTrip, getTrips, updateTripStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Search,
  User,
  ChevronDown,
  Box,
  AlertTriangle,
} from "lucide-react";

// Standalone Trip Dispatcher screen for TransitOps.
// Left column is a controlled "create trip" form with live capacity
// validation; right column is a "live board" timeline of trips. Dispatching
// a valid trip prepends it to the live board, simulating a POST /api/trips
// call followed by a re-fetch - the same pattern used on the Maintenance page.
export default function TripsPage() {
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const { user } = useAuth(); // Assume we're importing useAuth

  const lifecycleStages = ["Draft", "Dispatched", "Completed", "Cancelled"];

  const [liveBoard, setLiveBoard] = useState([]);
  const [form, setForm] = useState({
    source: "Gandhinagar Depot",
    destination: "Ahmedabad Hub",
    vehicleId: "",
    driverId: "",
    cargoWeight: "700",
    plannedDistance: "38",
  });
  const [currentStage, setCurrentStage] = useState("Draft");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
          getAvailableVehicles(),
          getAvailableDrivers(),
          getTrips(user?.id || 1),
        ]);
        setAvailableVehicles(vehiclesRes || []);
        setAvailableDrivers(driversRes || []);
        
        if (tripsRes && tripsRes.length > 0) {
          // Format trips from backend
          const formattedTrips = tripsRes.map(t => ({
            id: `TR${t.id}`,
            source: t.source,
            destination: t.destination,
            assignment: `${t.vehicle_name || 'Unassigned'} / ${t.driver_name || 'Unassigned'}`,
            status: t.status,
            note: ""
          }));
          setLiveBoard(formattedTrips);
        }
        
        if (vehiclesRes?.length > 0 && driversRes?.length > 0) {
          setForm(prev => ({
            ...prev,
            vehicleId: vehiclesRes[0].id.toString(),
            driverId: driversRes[0].id.toString()
          }));
        }
      } catch (error) {
        console.error("Failed to fetch available resources", error);
      } finally {
        setIsLoadingResources(false);
      }
    };
    fetchResources();
  }, []);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const selectedVehicle = useMemo(
    () => availableVehicles.find((v) => v.id.toString() === form.vehicleId),
    [availableVehicles, form.vehicleId]
  );
  
  const selectedDriver = useMemo(
    () => availableDrivers.find((d) => d.id.toString() === form.driverId),
    [availableDrivers, form.driverId]
  );

  const cargoWeightNum = Number(form.cargoWeight) || 0;
  const overweightBy = selectedVehicle ? cargoWeightNum - selectedVehicle.capacity : 0;
  const isOverCapacity = overweightBy > 0;

  const canDispatch =
    form.source && form.destination && form.vehicleId && form.driverId && cargoWeightNum > 0 && !isOverCapacity && !isSubmitting;

  const resetForm = () => {
    setForm({
      source: "Gandhinagar Depot",
      destination: "",
      vehicleId: availableVehicles.length > 0 ? availableVehicles[0].id.toString() : "",
      driverId: availableDrivers.length > 0 ? availableDrivers[0].id.toString() : "",
      cargoWeight: "",
      plannedDistance: "",
    });
    setCurrentStage("Draft");
  };

  const handleDispatch = async () => {
    if (!canDispatch) return;
    setIsSubmitting(true);
    
    const payload = {
      uid: user?.id || 1,
      source: form.source,
      destination: form.destination,
      vehicle_id: parseInt(form.vehicleId, 10),
      driver_id: parseInt(form.driverId, 10),
      cargo_weight: cargoWeightNum,
      distance: Number(form.plannedDistance) || 0,
      status: "Dispatched",
    };

    try {
      const response = await createTrip(payload);
      
      const newTrip = {
        id: `TR${response.trip_id || Math.floor(100 + Math.random() * 900)}`,
        source: form.source,
        destination: form.destination,
        assignment: `${selectedVehicle?.Vname || form.vehicleId} / ${selectedDriver?.name || form.driverId}`,
        status: "Dispatched",
        note: "Just dispatched",
      };
      
      setLiveBoard((board) => [newTrip, ...board]);
      setCurrentStage("Dispatched");
      
      // Update local available arrays directly or re-fetch
      setAvailableVehicles(prev => prev.filter(v => v.id.toString() !== form.vehicleId));
      setAvailableDrivers(prev => prev.filter(d => d.id.toString() !== form.driverId));
      
      // Also fetch trips again      // Refresh trips list
      const tripsRes = await getTrips(user?.id || 1);
      if (tripsRes) {
        const formattedTrips = tripsRes.map(t => ({
          id: `TR${t.id}`,
          source: t.source,
          destination: t.destination,
          assignment: `${t.vehicle_name || 'Unassigned'} / ${t.driver_name || 'Unassigned'}`,
          status: t.status,
          note: ""
        }));
        setLiveBoard(formattedTrips);
      }
      
      setTimeout(resetForm, 1200);
    } catch (err) {
      console.error("Failed to dispatch trip", err);
      alert(err.response?.data?.msg || "Failed to dispatch trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTripStatusChange = async (tripId, newStatus) => {
    try {
      // The tripId in the UI has a 'TR' prefix, e.g., TR12. The DB expects an integer ID.
      const rawId = parseInt(tripId.replace('TR', ''), 10);
      
      await updateTripStatus({ trip_id: rawId, status: newStatus });
      
      // If status is Completed or Cancelled, it frees up resources, so we re-fetch them.
      if (newStatus === "Completed" || newStatus === "Cancelled") {
        const [vehiclesRes, driversRes] = await Promise.all([
          getAvailableVehicles(),
          getAvailableDrivers(),
        ]);
        setAvailableVehicles(vehiclesRes || []);
        setAvailableDrivers(driversRes || []);
      }

      // Re-fetch trips to ensure everything is synced
      const tripsRes = await getTrips();
      if (tripsRes) {
        const formattedTrips = tripsRes.map(t => ({
          id: `TR${t.id}`,
          source: t.source,
          destination: t.destination,
          assignment: `${t.vehicle_name || 'Unassigned'} / ${t.driver_name || 'Unassigned'}`,
          status: t.status,
          note: ""
        }));
        setLiveBoard(formattedTrips);
      }
    } catch (err) {
      console.error("Failed to update trip status", err);
      alert(err.response?.data?.msg || "Failed to update trip status.");
    }
  };

  const statusStyles = {
    Dispatched: "bg-slate-800 text-white",
    Draft: "bg-slate-400 text-white",
    Completed: "bg-green-600 text-white",
    Cancelled: "bg-red-600 text-white",
  };

  return (
    <div className="p-8 flex-1 w-full bg-white text-slate-900 h-full overflow-auto">

          <h1 className="text-2xl font-bold text-slate-900 mb-6">Trip Dispatcher</h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
            {/* Left: lifecycle stepper + create trip form */}
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Trip Lifecycle
              </h2>

              {/* Horizontal stepper - a connecting line behind evenly-spaced stage dots */}
              <div className="relative flex items-center justify-between mb-8 max-w-md">
                <div className="absolute left-0 right-0 top-2 h-px bg-slate-200" />
                {lifecycleStages.map((stage) => {
                  const isCurrent = stage === currentStage;
                  return (
                    <div key={stage} className="relative z-10 flex flex-col items-center gap-2 bg-white px-1">
                      <span
                        className={`w-4 h-4 rounded-full border-2 ${
                          isCurrent ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300"
                        }`}
                      />
                      <span className={`text-xs ${isCurrent ? "text-slate-900 font-semibold" : "text-slate-400"}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>

              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Create Trip
              </h2>

              <div className="flex flex-col gap-4 max-w-md">
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Source</label>
                  <input
                    type="text"
                    value={form.source}
                    onChange={updateField("source")}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Destination</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={updateField("destination")}
                    placeholder="Where is this trip headed?"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Vehicle <span className="text-slate-400 font-normal">(Available only)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.vehicleId}
                      onChange={updateField("vehicleId")}
                      className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-9 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      {availableVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.Vname} — {v.capacity} kg capacity
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Driver <span className="text-slate-400 font-normal">(Available only)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.driverId}
                      onChange={updateField("driverId")}
                      className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-9 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      {availableDrivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.cargoWeight}
                    onChange={updateField("cargoWeight")}
                    // Field itself turns pink the moment the cargo exceeds the
                    // selected vehicle's capacity - matches the source design.
                    className={`w-full rounded-lg px-3 py-2.5 text-sm border focus:outline-none focus:ring-2 ${
                      isOverCapacity
                        ? "bg-red-50 border-red-300 text-red-900 focus:ring-red-200"
                        : "border-slate-200 focus:ring-amber-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Planned Distance (km)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.plannedDistance}
                    onChange={updateField("plannedDistance")}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                {isOverCapacity && selectedVehicle && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 leading-relaxed">
                    <p>Vehicle Capacity: {selectedVehicle.capacity} kg</p>
                    <p>Cargo Weight: {cargoWeightNum} kg</p>
                    <p className="flex items-center gap-1.5 mt-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Capacity exceeded by {overweightBy} kg — dispatch blocked
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-1">
                  <button
                    onClick={handleDispatch}
                    disabled={!canDispatch}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium py-3 rounded-lg shadow-sm transition-colors"
                  >
                    Dispatch
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 border border-slate-200 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Right: live board timeline */}
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Live Board
              </h2>

              <div className="relative flex flex-col gap-4">
                {/* Vertical connector line running behind the timeline dots */}
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />

                {liveBoard.map((trip, i) => (
                  <div key={trip.id} className="relative flex gap-4">
                    <span
                      className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                        i === 0 ? "bg-blue-500" : "bg-slate-300"
                      }`}
                    />
                    <div className="flex-1 border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{trip.id}</p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {trip.source} → {trip.destination}
                          </p>
                        </div>
                        <p className="text-sm text-slate-700 text-right shrink-0">{trip.assignment}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <select
                          value={trip.status}
                          onChange={(e) => handleTripStatusChange(trip.id, e.target.value)}
                          disabled={trip.status === "Completed" || trip.status === "Cancelled"}
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border-none outline-none appearance-none ${
                            trip.status === "Completed" || trip.status === "Cancelled" 
                              ? 'cursor-not-allowed opacity-80' 
                              : 'cursor-pointer'
                          } ${statusStyles[trip.status] || 'bg-slate-100 text-slate-700'}`}
                        >
                          <option value="Draft" disabled={trip.status !== "Draft"}>Draft</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <span className="text-xs text-slate-400">{trip.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </div>
  );
}
