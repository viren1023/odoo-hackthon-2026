import React from "react";
import { useNavigate } from "react-router-dom";
export default function FuelExpenses() {
    const navigate = useNavigate();
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Fuel & Expenses
          </h1>

          <p className="text-slate-500 mt-1">
            Record fuel logs and operational expenses.
          </p>
        </div>

        <button
            onClick={() => navigate("/fuel-expenses/new")}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
            + Add Expense
            </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search vehicle..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />

          <select className="border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300">
            <option>All Expenses</option>
            <option>Fuel</option>
            <option>Maintenance</option>
            <option>Toll</option>
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Fuel (L)</th>
              <th className="px-6 py-4">Fuel Cost</th>
              <th className="px-6 py-4">Maintenance</th>
              <th className="px-6 py-4">Other Expense</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan="6"
                className="text-center py-12 text-slate-500"
              >
                No expense records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}