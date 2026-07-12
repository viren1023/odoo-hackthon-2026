import React from 'react';
import { Activity, Users, Truck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.email || 'User'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Fleet</p>
            <h3 className="text-3xl font-bold text-slate-800">42</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Trips</p>
            <h3 className="text-3xl font-bold text-slate-800">18</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Drivers</p>
            <h3 className="text-3xl font-bold text-slate-800">35</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Alerts</p>
            <h3 className="text-3xl font-bold text-slate-800">3</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Dashboard Under Construction</h2>
        <p className="text-slate-500 max-w-md">
          This is a placeholder for your main dashboard. Once the backend analytics are ready, this area will feature dynamic charts and recent activity feeds.
        </p>
      </div>
    </div>
  );
}
