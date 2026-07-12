import React from "react";

export default function Reports() {
  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Reports
          </h1>

          <p className="text-slate-500 mt-1">
            Review operational expenses and profitability.
          </p>
        </div>

        <button className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-5 py-2.5 rounded-lg">
          Export CSV
        </button>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {[
          "Fuel Cost",
          "Maintenance Cost",
          "Operational Cost",
          "Fleet ROI",
        ].map((item) => (

          <div
            key={item}
            className="bg-white border border-slate-200 rounded-xl p-6"
          >
            <p className="text-slate-500 text-sm">{item}</p>

            <h2 className="text-3xl font-bold mt-2">
              ₹0
            </h2>

          </div>

        ))}

      </div>

      {/* Reports Table */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50 border-b">

            <tr>

              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Fuel Cost</th>
              <th className="px-6 py-4 text-left">Maintenance</th>
              <th className="px-6 py-4 text-left">Operational Cost</th>
              <th className="px-6 py-4 text-left">ROI</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td
                colSpan="5"
                className="text-center py-12 text-slate-500"
              >
                No report data available.
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}