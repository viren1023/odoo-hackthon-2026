import React from "react";

export default function DriverForm() {
  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Add Driver
        </h1>

        <p className="text-slate-500 mt-1">
          Create a new driver profile.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Driver Name
            </label>

            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Contact Number
            </label>

            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              License Number
            </label>

            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              License Category
            </label>

            <select className="w-full border border-slate-300 rounded-lg px-4 py-2">
              <option>LMV</option>
              <option>HMV</option>
              <option>Transport</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              License Expiry Date
            </label>

            <input
              type="date"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Safety Score
            </label>

            <input
              type="number"
              placeholder="0 - 100"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>

        </div>

        {/* Status */}
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium">
            Status
          </label>

          <select className="w-full border border-slate-300 rounded-lg px-4 py-2">
            <option>Available</option>
            <option>On Trip</option>
            <option>Off Duty</option>
            <option>Suspended</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">

          <button className="px-5 py-2 border border-slate-300 rounded-lg">
            Cancel
          </button>

          <button className="px-5 py-2 bg-amber-400 hover:bg-amber-500 rounded-lg font-medium">
            Save Driver
          </button>

        </div>

      </div>

    </div>
  );
}