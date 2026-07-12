import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Receipt,
  BarChart3,
  LogOut,
  Box,
  Settings,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

// Each item's `roles: null` means "visible to everyone logged in"; an array
// scopes it the same way AppRoutes.jsx scopes the actual route, so the
// sidebar never advertises a link RBAC would immediately block.
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: null },
  { to: '/vehicles', label: 'Vehicle Registry', icon: Truck, roles: ['fleet_manager'] },
  { to: '/drivers', label: 'Drivers', icon: Users, roles: ['fleet_manager', 'safety_officer'] },
  { to: '/trips', label: 'Trips', icon: RouteIcon, roles: ['fleet_manager', 'dispatcher'] },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['fleet_manager'] },
  { to: '/fuel-expenses', label: 'Fuel & Expenses', icon: Receipt, roles: ['fleet_manager', 'financial_analyst'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['fleet_manager', 'financial_analyst'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: null },
];

const ROLE_LABELS = {
  fleet_manager: 'Fleet Manager',
  dispatcher: 'Dispatcher',
  safety_officer: 'Safety Officer',
  financial_analyst: 'Financial Analyst',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    // Two-column app shell: fixed-width dark sidebar + flexible light content
    // area, echoing the same slate-900 / slate-50 pairing as the auth pages.
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Box className="w-5 h-5 text-slate-900" strokeWidth={1.75} />
          </div>
          <span className="text-white font-semibold text-lg">TransitOps</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <div className="px-3 pb-3 text-xs text-slate-500">
            Signed in as{' '}
            <span className="text-slate-300">
              {user?.name} · {ROLE_LABELS[user?.role] ?? user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Topbar */}
        <header className="flex items-center gap-6 px-8 py-4 border-b border-slate-200 bg-white">
          <div className="flex-1"></div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-slate-900">{user?.name || user?.email || 'User'}</p>
              <p className="text-xs text-slate-500">{ROLE_LABELS[user?.role] || user?.role || 'Guest'}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Outlet renders whichever protected page matched the current route */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
