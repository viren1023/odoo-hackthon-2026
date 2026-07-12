import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import DriverManagement from "../pages/SafetyOfficer/DriverManagement";
import DriverForm from "../pages/SafetyOfficer/DriverForm";
import LicenseCompliance from "../pages/SafetyOfficer/LicenseCompliance";
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import VehicleRegistryPage from '../pages/VehicleregisterayPage.jsx'
// import DriverManagementPage from '../pages/DriverManagementPage.jsx';
import TripManagementPage from '../pages/TripsPage'
import MaintenancePage from '../pages/MaintenencePage.jsx'
import FuelExpense from '../pages/Financial/FuelExpenses.jsx';
import Reports from '../pages/Financial/Reports.jsx';
// import UnauthorizedPage from '../pages/UnauthorizedPage.jsx';
// import NotFoundPage from '../pages/NotFoundPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import AboutUsPage from '../pages/AboutUsPage.jsx';
import TermsAndConditionPage from '../pages/Terms&ConditionPage.jsx';
import ExpenseForm from "../pages/Financial/ExpenseForm";

// ----------------------------------------------------------------------------
// ROLE ACCESS MAP
// Derived from spec section 2 (Target Users). Every authenticated role can
// reach the Dashboard; everything else is scoped to whoever the spec says
// owns that area. Adjust freely — this is a single, easy-to-edit place to
// change permissions instead of hunting through each page.
// ----------------------------------------------------------------------------
const ROLES = {
  FLEET_MANAGER: 'fleet_manager',
  DISPATCHER: 'dispatcher',
  SAFETY_OFFICER: 'safety_officer',
  FINANCIAL_ANALYST: 'financial_analyst',
};

export default function AppRoutes() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      {/* ---------------- Public routes ---------------- */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              // login() stores the { token, user } in AuthContext (and
              // localStorage); navigate() then hands off to the dashboard.
              onLoginSuccess={(result) => {
                login(result);
                navigate('/dashboard', { replace: true });
              }}
              onNavigateToRegister={() => navigate('/register')}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterPage
              // Auto-login right after registration for a smoother demo —
              // switch this to navigate('/login') instead if you'd rather
              // require a separate sign-in step.
              onRegisterSuccess={(result) => {
                login(result);
                navigate('/dashboard', { replace: true });
              }}
              onNavigateToLogin={() => navigate('/login')}
            />
          )
        }
      />

      {/* ---------------- Protected routes (share the sidebar layout) ---------------- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* 3.2 Dashboard — open to every authenticated role */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* 3.3 Vehicle Registry, 3.6 Maintenance — Fleet Manager owns fleet assets */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.FLEET_MANAGER]} />}>
            <Route path="/vehicles" element={<VehicleRegistryPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
          </Route>

          {/* 3.4 Driver Management — Fleet Manager + Safety Officer (license/compliance) */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER]} />}>
            <Route path="/drivers" element={<DriverManagement />} />
            <Route path="/drivers/new" element={<DriverForm />} />
            {/* <Route path="/license-compliance" element={<LicenseCompliance />} /> */}
          </Route>

          {/* 3.5 Trip Management — Fleet Manager + Dispatcher */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.FLEET_MANAGER, ROLES.DISPATCHER]} />}>
            <Route path="/trips" element={<TripManagementPage />} />
          </Route>

          {/* 3.7 Fuel & Expenses, 3.8 Reports — Fleet Manager + Financial Analyst */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST]} />}>
            <Route path="/fuel-expenses" element={<FuelExpense />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/fuel-expenses/new" element={<ExpenseForm />} />
          </Route>

          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/terms" element={<TermsAndConditionPage />} />
        </Route>
      </Route>

      {/* ---------------- Fallbacks ---------------- */}
      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
