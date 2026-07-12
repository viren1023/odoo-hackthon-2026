import React from "react";
import { Box, Truck, Route, Wrench, BarChart3, ArrowRight, Mail } from "lucide-react";

// Standalone About Us page for TransitOps.
// Unlike the internal app screens, this is a public marketing page, so it
// uses a simple top nav instead of the sidebar shell - but keeps the same
// palette, type scale, and card treatment for a consistent brand feel.
export default function AboutUsPage() {
  // Mock content blocks, shaped roughly like what a CMS/FastAPI endpoint
  // (e.g. GET /api/content/about) could return. Mapped over below instead
  // of being hard-coded into the JSX, so the page stays data-driven.
  const stats = [
    { label: "Depots Live", value: "120+" },
    { label: "Vehicles Tracked", value: "4,800+" },
    { label: "Trips Dispatched / Day", value: "9,300+" },
    { label: "Founded", value: "2019" },
  ];

  const capabilities = [
    {
      icon: Truck,
      title: "Fleet Registry",
      description: "One source of truth for every vehicle, from acquisition cost to odometer reading.",
    },
    {
      icon: Route,
      title: "Trip Dispatch",
      description: "Match cargo to capacity automatically and catch overloads before a trip ever leaves the depot.",
    },
    {
      icon: Wrench,
      title: "Maintenance Logs",
      description: "Service records and shop status stay linked, so an in-shop vehicle is never accidentally dispatched.",
    },
    {
      icon: BarChart3,
      title: "Operational Analytics",
      description: "Roll up cost, utilization, and downtime across the whole depot network in one view.",
    },
  ];

  const navLinks = ["About", "Terms", "Sign In"];

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* Top nav - simple flex row, logo left / links right, no sidebar on public pages */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-slate-900" strokeWidth={1.75} />
          <span className="text-lg font-bold">TransitOps</span>
        </div>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <button key={link} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {link}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16">
        {/* Hero */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">About Us</p>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            Built for the people who keep vehicles moving.
          </h1>
          <p className="text-slate-500 text-lg mt-5 leading-relaxed">
            TransitOps started as a whiteboard in a single depot office and grew into the operations
            layer that dispatchers, fleet managers, and maintenance crews rely on every day. We build
            software the way a good dispatcher thinks: plainly, quickly, and with zero patience for
            avoidable mistakes.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          {stats.map((stat) => (
            <div key={stat.label} className="border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div className="mt-20">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-6">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <div key={title} className="border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-amber-600" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our story */}
        <div className="mt-20 max-w-2xl">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-6">Our Story</h2>
          <div className="flex flex-col gap-4 text-slate-600 leading-relaxed">
            <p>
              Every feature in TransitOps traces back to a real depot problem: a truck dispatched over
              capacity, a maintenance record that lived in someone's notebook, a driver assigned to two
              trips at once. We kept the fixes simple on purpose, because the people using this software
              are managing real vehicles on a real clock, not exploring a dashboard for fun.
            </p>
            <p>
              Today the team is spread across a handful of cities, but the product decisions still get
              made the same way they did on day one: sit with a dispatcher, watch where the friction is,
              and remove it.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-slate-50">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Want to see it running your depot?</h2>
            <p className="text-sm text-slate-500 mt-1">We'll walk you through fleet, trips, and maintenance together.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-5 py-3 rounded-lg shadow-sm transition-colors shrink-0">
            <Mail className="w-4 h-4" />
            Get in touch
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <footer className="border-t border-slate-200 px-8 py-6 text-center text-xs text-slate-400">
        TransitOps · Smart Transport Operations Platform
      </footer>
    </div>
  );
}
