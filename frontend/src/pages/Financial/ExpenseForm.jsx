import React from "react";

export default function ExpenseForm() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Add Expense
        </h1>

        <p className="text-slate-500 mt-1">
          Record fuel and operational expenses.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Vehicle
            </label>

            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Expense Type
            </label>

            <select className="w-full border border-slate-300 rounded-lg px-4 py-2">
              <option>Fuel</option>
              <option>Maintenance</option>
              <option>Toll</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Fuel (Liters)
            </label>

            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Cost
            </label>

            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Date
            </label>

            <input
              type="date"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button className="px-5 py-2 border border-slate-300 rounded-lg">
            Cancel
          </button>

          <button className="px-5 py-2 bg-amber-400 hover:bg-amber-500 rounded-lg font-medium">
            Save Expense
          </button>

        </div>

      </div>
    </div>
  );
}