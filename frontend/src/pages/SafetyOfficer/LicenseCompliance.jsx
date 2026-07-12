import React from "react";

export default function LicenseCompliance() {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          License Compliance
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor license validity and driver compliance.
        </p>
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
            <option>Valid</option>
            <option>Expiring Soon</option>
            <option>Expired</option>
          </select>

        </div>
      </div>

      {/* License Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50 border-b">

            <tr className="text-left text-sm text-slate-600">

              <th className="px-6 py-4">Driver Name</th>
              <th className="px-6 py-4">License Number</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td
                colSpan="5"
                className="text-center py-12 text-slate-500"
              >
                No license records found.
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}