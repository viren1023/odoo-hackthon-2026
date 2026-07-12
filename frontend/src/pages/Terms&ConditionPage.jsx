import React, { useState } from "react";
import { Box } from "lucide-react";

// Standalone Terms & Conditions page for TransitOps.
// Same simple public top nav as the About Us page. Content is a mock array
// of clauses (shaped like GET /api/content/terms would return) mapped into
// numbered sections, with a sticky table of contents that tracks scroll
// position via a lightweight IntersectionObserver.
export default function TermsAndConditionsPage() {
  const lastUpdated = "January 1, 2026";

  // Mock clause data - each clause is its own section, identified by a slug
  // so the table of contents can deep-link to it with a plain <a href="#...">.
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      paragraphs: [
        "By creating an account or otherwise accessing TransitOps, you agree to be bound by these Terms & Conditions. If you are using TransitOps on behalf of an organization, you confirm you have the authority to accept these terms on that organization's behalf.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts & Access",
      paragraphs: [
        "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account, including actions taken by dispatchers or drivers you grant access to.",
        "We may suspend or terminate access to protect the integrity of the platform, including in cases of suspected unauthorized use.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use",
      paragraphs: [
        "TransitOps is provided for legitimate fleet, trip, and maintenance operations. You agree not to use the platform to enter fraudulent vehicle or trip records, to circumvent capacity or safety validations, or to interfere with other organizations' data.",
      ],
    },
    {
      id: "data",
      title: "Your Data",
      paragraphs: [
        "Fleet, trip, driver, and maintenance records you enter remain yours. We process this data to operate the platform - for example, to power dispatch validations and analytics - and do not sell it to third parties.",
        "You can export or request deletion of your organization's data at any time, subject to legal retention requirements that may apply to certain operational records.",
      ],
    },
    {
      id: "availability",
      title: "Service Availability",
      paragraphs: [
        "We aim for high availability but do not guarantee uninterrupted access. Scheduled maintenance windows will be communicated in advance where practical.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      paragraphs: [
        "TransitOps is a dispatch and record-keeping tool, not a substitute for a driver's or dispatcher's own judgment. To the maximum extent permitted by law, TransitOps is not liable for losses arising from decisions made using information in the platform.",
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms",
      paragraphs: [
        "We may update these terms as the platform evolves. Material changes will be announced within the app ahead of taking effect. Continued use after changes take effect constitutes acceptance.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Questions about these terms can be sent to your account's designated support contact from within the app.",
      ],
    },
  ];

  // Tracks which section is currently in view, purely to highlight the
  // matching table-of-contents entry - no routing library needed for this.
  const [activeId, setActiveId] = useState(sections[0].id);

  const navLinks = ["About", "Terms", "Sign In"];

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* Top nav */}
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
        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">Legal</p>
        <h1 className="text-4xl font-bold text-slate-900">Terms &amp; Conditions</h1>
        <p className="text-sm text-slate-500 mt-3">Last updated: {lastUpdated}</p>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 mt-14">
          {/* Table of contents - sticky so it stays visible while the long content scrolls */}
          <nav className="md:sticky md:top-16 self-start">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">On this page</p>
            <ul className="flex flex-col gap-1 border-l border-slate-200">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setActiveId(section.id)}
                    className={`block pl-4 -ml-px py-1.5 text-sm border-l-2 transition-colors ${
                      activeId === section.id
                        ? "border-amber-400 text-slate-900 font-medium"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {i + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Clause content */}
          <div className="flex flex-col gap-12">
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  {i + 1}. {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-sm text-slate-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 px-8 py-6 text-center text-xs text-slate-400">
        TransitOps · Smart Transport Operations Platform
      </footer>
    </div>
  );
}
