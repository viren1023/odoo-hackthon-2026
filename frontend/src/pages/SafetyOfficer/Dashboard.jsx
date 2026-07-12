import React from "react";
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Safety Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor driver compliance, license validity and safety scores.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Total Drivers</p>
            <h2 className="text-3xl font-bold text-slate-800">0</h2>
          </div>

          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="text-blue-600 w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Available Drivers</p>
            <h2 className="text-3xl font-bold text-slate-800">0</h2>
          </div>

          <div className="bg-green-100 p-3 rounded-lg">
            <UserCheck className="text-green-600 w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Drivers On Trip</p>
            <h2 className="text-3xl font-bold text-slate-800">0</h2>
          </div>

          <div className="bg-indigo-100 p-3 rounded-lg">
            <ShieldCheck className="text-indigo-600 w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Suspended Drivers</p>
            <h2 className="text-3xl font-bold text-slate-800">0</h2>
          </div>

          <div className="bg-red-100 p-3 rounded-lg">
            <UserX className="text-red-600 w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Expired Licenses</p>
            <h2 className="text-3xl font-bold text-slate-800">0</h2>
          </div>

          <div className="bg-orange-100 p-3 rounded-lg">
            <AlertTriangle className="text-orange-600 w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Expiring Soon</p>
            <h2 className="text-3xl font-bold text-slate-800">0</h2>
          </div>

          <div className="bg-yellow-100 p-3 rounded-lg">
            <CalendarClock className="text-yellow-600 w-6 h-6" />
          </div>
        </div>

      </div>
      {/* Driver Overview */}
        <div className="bg-white border border-slate-200 rounded-xl mt-8 overflow-hidden">

        <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-slate-800">
            Driver Overview
            </h2>
        </div>

        <table className="w-full">

            <thead className="bg-slate-50">

            <tr className="text-left text-sm text-slate-600">

                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">License Expiry</th>
                <th className="px-6 py-4">Safety Score</th>
                <th className="px-6 py-4">Status</th>

            </tr>

            </thead>

            <tbody>

            <tr>

                <td
                colSpan="4"
                className="text-center py-10 text-slate-500"
                >
                No driver data available.
                </td>

            </tr>

            </tbody>

        </table>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {/* Upcoming Renewals */}

            <div className="bg-white border border-slate-200 rounded-xl p-6">

                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Upcoming License Renewals
                </h2>

                <p className="text-slate-500">
                No upcoming renewals.
                </p>

            </div>

            {/* Compliance Alerts */}

            <div className="bg-white border border-slate-200 rounded-xl p-6">

                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Compliance Alerts
                </h2>

                <p className="text-slate-500">
                No compliance alerts.
                </p>

            </div>

            </div>

        </div>

    </div>
  );
}