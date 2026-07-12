import React, { useState } from 'react';
import { Box, Mail, Lock, ChevronDown, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

// ============================================================================
// MOCK DATA — stands in for real FastAPI backend responses during dev/demo.
// Replace the two items below with real endpoints when the backend is ready:
//   GET  /api/v1/roles        -> MOCK_ROLES
//   POST /api/v1/auth/login   -> mockLoginRequest()
//
// Demo credentials (for judges/testers to try the flow end-to-end):
//   fleet@transitops.io      / fleet123    / Fleet Manager
//   dispatch@transitops.io   / dispatch123 / Dispatcher
//   safety@transitops.io     / safety123   / Safety Officer
//   finance@transitops.io    / finance123  / Financial Analyst
// ============================================================================

const MOCK_ROLES = [
  { id: 'fleet_manager', label: 'Fleet Manager' },
  { id: 'dispatcher', label: 'Dispatcher' },
  { id: 'safety_officer', label: 'Safety Officer' },
  { id: 'financial_analyst', label: 'Financial Analyst' },
];

const MOCK_USERS_DB = [
  { email: 'fleet@transitops.io', password: 'fleet123', role: 'fleet_manager', name: 'Priya Shah' },
  { email: 'dispatch@transitops.io', password: 'dispatch123', role: 'dispatcher', name: 'Alex Rivera' },
  { email: 'safety@transitops.io', password: 'safety123', role: 'safety_officer', name: 'Jordan Lee' },
  { email: 'finance@transitops.io', password: 'finance123', role: 'financial_analyst', name: 'Sam Patel' },
];

// Simulated network round-trip. Swap the body for a real
// `fetch('/api/v1/auth/login', { method: 'POST', body: ... })` later —
// the calling code below doesn't need to change since it already awaits
// a promise that resolves/rejects the same shape.
function mockLoginRequest({ email, password, role }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const match = MOCK_USERS_DB.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!match) return reject({ field: 'email', message: 'No account found with this email.' });
      if (match.password !== password) return reject({ field: 'password', message: 'Incorrect password.' });
      if (match.role !== role) {
        const actualLabel = MOCK_ROLES.find((r) => r.id === match.role)?.label ?? match.role;
        return reject({ field: 'role', message: `This account is registered as ${actualLabel}, not the selected role.` });
      }
      resolve({ token: `mock-jwt-token.${btoa(email)}`, user: { name: match.name, email: match.email, role: match.role } });
    }, 900); // artificial latency so the loading state is visible in the demo
  });
}

/**
 * Standalone Login page. Self-contained: brings its own mock data, its own
 * validation, and its own submit handling. Two optional callback props let
 * a parent (e.g. a router or App.jsx) hook into the result without this
 * component needing to know about routing:
 *   - onLoginSuccess(result)     called with { token, user } on success
 *   - onNavigateToRegister()     called when the user taps "Create one"
 */
export default function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  // Single object for the three form fields — keeps them together and lets
  // one generic handleChange cover every input via its `name` attribute,
  // instead of one useState per field.
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Field-level errors keyed by field name so each input renders its own
  // message inline, rather than one big conditional block.
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(''); // non-field errors (network, etc.)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear that field's error the moment the user starts fixing it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!formData.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Enter a valid email address.';
    if (!formData.password) next.password = 'Password is required.';
    if (!formData.role) next.role = 'Select a role to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await mockLoginRequest(formData);
      onLoginSuccess?.(result);
    } catch (err) {
      if (err?.field) setErrors((prev) => ({ ...prev, [err.field]: err.message }));
      else setApiError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Page wrapper: centers the auth card on a neutral slate-100 backdrop.
    // The card itself (not this wrapper) carries the actual brand palette.
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">

        {/* ---------------- LEFT: brand / role context ---------------- */}
        {/* flex-col + justify-center vertically centers the brand block.
            On mobile this simply stacks above the form (flex-col on the
            parent) instead of being hidden, so context isn't lost. */}
        <div className="w-full md:w-1/2 bg-slate-50 p-8 sm:p-10 flex flex-col justify-center">
          <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-6">
            <Box className="w-6 h-6 text-white" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">TransitOps</h1>
          <p className="text-slate-500 mt-2 mb-8">Smart Transport Operations Platform</p>

          {/* Mapping over MOCK_ROLES here (instead of hardcoding four <li>s)
              means this list and the <select> below always stay in sync —
              one source of truth for what roles exist. */}
          <ul className="space-y-3">
            {MOCK_ROLES.map((role) => (
              <li key={role.id} className="flex items-center text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3" />
                {role.label}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- RIGHT: sign-in form ---------------- */}
        <div className="w-full md:w-1/2 bg-slate-900 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Sign in to your account</h2>

          {apiError && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full rounded-lg bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 border ${
                    errors.email ? 'border-red-400' : 'border-transparent'
                  } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                />
              </div>
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password with show/hide toggle */}
            <div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full rounded-lg bg-white pl-10 pr-10 py-3 text-slate-900 placeholder-slate-400 border ${
                    errors.password ? 'border-red-400' : 'border-transparent'
                  } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Role selection — native <select> avoids pulling in a combobox
                dependency; MOCK_ROLES.map() generates the <option>s so this
                stays wired to the same data as the left-panel list above. */}
            <div>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full appearance-none rounded-lg bg-white pl-4 pr-10 py-3 border ${
                    errors.role ? 'border-red-400' : 'border-transparent'
                  } focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    formData.role ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <option value="" disabled>Role Selection</option>
                  {MOCK_ROLES.map((role) => (
                    <option key={role.id} value={role.id} className="text-slate-900">
                      {role.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.role && <p className="text-red-300 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-500 text-amber-500 focus:ring-amber-400 bg-slate-800"
                />
                Remember me
              </label>
              <button type="button" className="text-amber-400 hover:text-amber-300">
                Forgot password?
              </button>
            </div>

            {/* Submit — disabled + spinner while the mock request is in flight,
                mirroring how a real await fetch(...) call would feel. */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg py-3 mt-2 flex items-center justify-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="text-center text-sm text-slate-400 pt-2">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
