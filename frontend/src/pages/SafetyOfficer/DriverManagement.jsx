import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDrivers, updateDriverStatus } from "../../services/api";
export default function DriverManagement() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (err) {
        console.error("Failed to fetch drivers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const handleStatusChange = async (license_number, newStatus) => {
    try {
      await updateDriverStatus({ license_number, status: newStatus });
      setDrivers(prev => prev.map(driver =>
        driver.license_number === license_number
          ? { ...driver, status: newStatus }
          : driver
      ));
    } catch (err) {
      console.error("Failed to update driver status", err);
      alert("Failed to update driver status. Please try again.");
    }
  };
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Driver Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage driver records, licenses and safety information.
          </p>
        </div>

        <button
          onClick={() => navigate("/drivers/new")}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          + Add Driver
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search driver..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />

          <select className="border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300">
            <option>All Status</option>
            <option>Available</option>
            <option>Off Duty</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>
      {/* Driver Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4">Driver Name</th>
              <th className="px-6 py-4">License No.</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-500">
                  No driver records found.
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4">{driver.name}</td>
                  <td className="px-6 py-4">{driver.license_number}</td>
                  <td className="px-6 py-4">{driver.category}</td>
                  <td className="px-6 py-4">{new Date(driver.license_expiry_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={driver.status}
                      onChange={(e) => handleStatusChange(driver.license_number, e.target.value)}
                      disabled={driver.status === 'On Trip'}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none appearance-none cursor-pointer ${driver.status === 'Available' ? 'bg-green-100 text-green-700' :
                          driver.status === 'On Trip' ? 'bg-blue-100 text-blue-700 opacity-70 cursor-not-allowed' :
                            'bg-slate-100 text-slate-700'
                        }`}
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}