import React, { useState } from "react";
import { Box, Mail, ArrowLeft, Loader2 } from "lucide-react";

// Standalone Forgot Password screen for TransitOps.
// Mirrors the two-panel auth layout used across the app's auth flow:
// a quiet slate-50 brand panel on the left, and the active form on the right.
export default function ForgotPasswordPage() {
  // Local form state - in the real app this would eventually call
  // POST /api/auth/forgot-password on the FastAPI backend.
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [error, setError] = useState("");

  // Mock shape of what the FastAPI backend would return.
  // Kept intentionally generic (no "user not found" leakage) for security.
  const mockApiResponse = {
    success: true,
    message: "If an account exists for this email, a reset link has been sent.",
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("loading");
    // Simulate network latency talking to the backend.
    setTimeout(() => {
      setStatus("sent");
    }, 800);
  };

  return (
    // Full-viewport centering wrapper; card itself carries all the visual weight.
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left brand panel - flex column so the tagline can sit lower, matching the mock */}
        <div className="w-full md:w-1/2 bg-slate-50 p-10 md:p-12 flex flex-col justify-center">
          <Box className="w-9 h-9 text-slate-900" strokeWidth={1.75} />
          <h1 className="text-3xl font-bold text-slate-900 mt-3">TransitOps</h1>
          <p className="text-sm text-slate-500 mt-1">Smart Transport Operations Platform</p>
          <p className="text-xl text-slate-700 mt-12 leading-snug max-w-xs">
            Don&apos;t worry, we&apos;ll help you get back on track.
          </p>
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-6">Forgot Password</h2>

          {status === "sent" ? (
            // Success state replaces the form entirely, echoing the backend's response text.
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4 leading-relaxed">
              {mockApiResponse.message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Email Address"
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow"
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-red-600 -mt-1">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mt-1"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-6 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
