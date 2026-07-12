import React from "react";
import { useNavigate } from "react-router-dom";
export default function DriverManagement() {
    const navigate = useNavigate();
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
            <option>On Trip</option>
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
                <th className="px-6 py-4">Safety Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
            </tr>
            </thead>

            <tbody>
            <tr>
                <td
                colSpan="7"
                className="text-center py-12 text-slate-500"
                >
                No driver records found.
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
  );
}