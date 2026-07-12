import React, { useState, useMemo } from "react";
import { Box, Lock, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";

// Standalone New/Reset Password screen for TransitOps.
// Same two-panel auth shell as Forgot Password, with the tagline swapped
// and a password + confirm-password form in place of the email step.
export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  // Mock response the FastAPI backend would send back on
  // POST /api/auth/reset-password.
  const mockApiResponse = {
    success: true,
    message: "Your password has been updated. You can now sign in.",
  };

  // Lightweight strength check purely for UI feedback - not a security control.
  const strength = useMemo(() => {
    if (!password) return { label: "", score: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return { label: labels[Math.max(score - 1, 0)], score };
  }, [password]);

  const strengthColor =
    ["bg-red-400", "bg-amber-400", "bg-amber-400", "bg-green-500"][
      Math.max(strength.score - 1, 0)
    ] || "bg-slate-200";

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("loading");
    // Simulate the round trip to the backend.
    setTimeout(() => setStatus("success"), 800);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left brand panel */}
        <div className="w-full md:w-1/2 bg-slate-50 p-10 md:p-12 flex flex-col justify-center">
          <Box className="w-9 h-9 text-slate-900" strokeWidth={1.75} />
          <h1 className="text-3xl font-bold text-slate-900 mt-3">TransitOps</h1>
          <p className="text-sm text-slate-500 mt-1">Smart Transport Operations Platform</p>
          <p className="text-xl text-slate-700 mt-12 leading-snug max-w-xs">
            Secure your account with a strong password.
          </p>
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-6">Reset Password</h2>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4 leading-relaxed">
              {mockApiResponse.message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              {/* New password field */}
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="New Password"
                  className="w-full pl-9 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter - only shown once the user starts typing */}
              {password && (
                <div className="flex items-center gap-2 -mt-1">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-10 text-right">{strength.label}</span>
                </div>
              )}

              {/* Confirm password field */}
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Confirm Password"
                  className="w-full pl-9 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live match indicator */}
              {confirmPassword && (
                <p
                  className={`flex items-center gap-1 text-xs -mt-1 ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordsMatch ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </p>
              )}

              {status === "error" && <p className="text-xs text-red-600 -mt-1">{error}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mt-1"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "loading" ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
