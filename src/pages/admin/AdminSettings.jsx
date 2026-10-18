
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ShieldCheck,
  Scale,
  Users,
  BriefcaseBusiness,
  FileText,
  LockKeyhole,
  AlertTriangle,
  LogOut,
  ChevronRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAdmin } from "../../hooks/Hook";

const guidelines = [
  {
    id: "overview",
    number: "01",
    title: "Introduction and Purpose",
    icon: BookOpen,
    content: `Peer.Hiring is a platform designed to connect job seekers with recruiters and employers. The administrator is responsible for maintaining the integrity, reliability, and professional standards of the platform.

The administrator must ensure that the platform remains useful for genuine employment opportunities, that users are treated fairly, and that platform rules are applied consistently. Every administrative action should serve a legitimate operational purpose.

Administrative access is a responsibility, not a privilege to be used arbitrarily. Decisions should be based on available evidence, platform policies, and the interests of the community.`,
  },
  {
    id: "responsibilities",
    number: "02",
    title: "Administrator Responsibilities",
    icon: ShieldCheck,
    content: `The administrator oversees platform operations, user management, job listings, company records, and reports submitted by users.

Responsibilities include reviewing reported content, investigating suspicious activity, identifying misleading job postings, maintaining accurate platform records, and ensuring that administrative actions are appropriate.

The administrator should review relevant information before blocking an account, removing a job, or taking action against a company. Actions should be proportionate to the issue and consistent with applicable platform policies.

Administrative tools must not be used for personal disputes, retaliation, favoritism, or unauthorized interference with user accounts.`,
  },
  {
    id: "users",
    number: "03",
    title: "User Conduct and Account Management",
    icon: Users,
    content: `Users are expected to provide accurate information, behave professionally, and use Peer.Hiring for legitimate employment-related activities.

The administrator may investigate accounts associated with impersonation, harassment, fraudulent activity, repeated policy violations, or misuse of the platform.

Before taking enforcement action, the administrator should review the available evidence and distinguish between a genuine violation and an unverified allegation.

Account restrictions should be based on reasonable grounds. Where appropriate and supported by platform functionality, users should be informed of the reason for an action and how they may request a review.

No user should be penalized solely because of a personal disagreement or an unsupported accusation.`,
  },
  {
    id: "jobs",
    number: "04",
    title: "Job Listings and Recruitment Standards",
    icon: BriefcaseBusiness,
    content: `Job listings should describe genuine opportunities and provide information that helps candidates understand the position, responsibilities, requirements, and application process.

The administrator should pay attention to suspicious requests for upfront payments, misleading salary claims, impersonated companies, deceptive recruitment practices, and listings that appear designed to collect sensitive information without a legitimate purpose.

Reported listings should be evaluated using the information available to the platform. Where necessary, the administrator may request verification or remove content that violates established platform rules.

The administrator must not alter job information to mislead applicants, favor a particular recruiter without a legitimate reason, or use applicant information for personal benefit.`,
  },
  {
    id: "companies",
    number: "05",
    title: "Company Verification and Recruiter Integrity",
    icon: CheckCircle2,
    content: `Company verification should help users distinguish credible employers from potentially misleading or impersonated organizations.

The administrator should evaluate the evidence available for a company, including its submitted details, relevant business information, recruiter identity, and reported conduct.

Verification must not be granted merely because an organization requests it, nor denied for personal or discriminatory reasons. Decisions should be consistent and supported by the available evidence.

A verification status should never be represented as a guarantee that every job, recruiter, or communication associated with a company is safe. Users should continue to exercise reasonable caution.`,
  },
  {
    id: "reports",
    number: "06",
    title: "Reports, Complaints, and Moderation",
    icon: FileText,
    content: `Reports are an important mechanism for identifying potentially harmful activity on Peer.Hiring. Each report should be reviewed objectively and handled according to its seriousness and available evidence.

The administrator should distinguish between the report itself, the allegation being made, and facts that have been independently established. A submitted report is not automatically proof of wrongdoing.

Where multiple reports concern the same account, company, or job, relevant information may be considered together. However, repeated allegations should not replace a fair review of the underlying evidence.

The outcome may include no action, a request for additional information, content removal, an account restriction, or another action supported by platform functionality and policy.

Report information should only be accessed or shared when necessary for legitimate moderation and operational purposes.`,
  },
  {
    id: "privacy",
    number: "07",
    title: "Privacy and Data Protection",
    icon: LockKeyhole,
    content: `Users may provide personal information such as names, email addresses, resumes, employment history, and application details. This information must be handled responsibly.

The administrator must access personal data only when necessary for an authorized platform task. Data must not be downloaded, copied, disclosed, sold, or used for unrelated personal or commercial purposes.

Passwords, authentication credentials, private tokens, and other sensitive security information must not be exposed through logs, screenshots, public reports, or administrative interfaces.

Information should be retained and handled according to the platform's applicable privacy policy and legal obligations. Suspected data exposure or unauthorized access should be treated seriously and escalated through the appropriate process.

These guidelines do not replace the applicable privacy policy or legal requirements.`,
  },
  {
    id: "security",
    number: "08",
    title: "Administrator Account Security",
    icon: ShieldCheck,
    content: `Administrator credentials must remain confidential. The administrator should use a strong, unique password and must not share account access with unauthorized individuals.

Administrative actions should be performed only through the authorized application and trusted devices. Unexpected authentication behavior, suspicious account changes, or signs of unauthorized access should be investigated promptly.

The administrator must never attempt to bypass access controls, disclose secrets, or use another person's credentials. Security-related changes should be implemented through approved application functionality.

Logout should be used whenever the administrator finishes working on a shared or untrusted device. The administrator should also keep the browser and operating system reasonably up to date.`,
  },
  {
    id: "fairness",
    number: "09",
    title: "Fairness, Integrity, and Conflicts of Interest",
    icon: Scale,
    content: `Administrative decisions should be impartial, consistent, and focused on legitimate platform needs.

The administrator must not misuse administrative authority to favor friends, disadvantage competitors, manipulate recruitment outcomes, or obtain personal benefits from platform access.

Where a decision may be affected by a personal conflict of interest, it should be handled transparently and, where possible, reviewed by an appropriate independent party.

All enforcement actions should be based on relevant information and should avoid unnecessary harm to users, recruiters, and companies.`,
  },
  {
    id: "violations",
    number: "10",
    title: "Policy Violations and Enforcement",
    icon: AlertTriangle,
    content: `Conduct that may require enforcement includes fraudulent job listings, impersonation, harassment, unauthorized access, repeated abuse of platform features, misuse of personal information, and deliberate attempts to undermine platform security.

The response should be proportionate to the severity, frequency, and evidence of the conduct. Depending on the available features and applicable policy, this may involve a warning, removal of content, temporary restriction, or account blocking.

The administrator should avoid irreversible action when the evidence is unclear and a less restrictive response is appropriate. Serious security or fraud concerns should be handled promptly.

These guidelines do not authorize an action unless the relevant administrative functionality and permissions exist in the application.`,
  },
  {
    id: "limitations",
    number: "11",
    title: "Limitations of Administrative Authority",
    icon: LockKeyhole,
    content: `Administrator access must only be used for the functions authorized by the application.

The administrator must not access private systems, external accounts, databases, or infrastructure without proper authorization. Platform access does not grant unlimited rights over user information or third-party services.

Changes to production data, access rules, or platform configuration should be made carefully and with appropriate safeguards.

The administrator should not promise users outcomes that the platform cannot guarantee, including guaranteed employment, guaranteed company legitimacy, or guaranteed protection from every fraudulent activity.`,
  },
  {
    id: "updates",
    number: "12",
    title: "Review and Updates to These Guidelines",
    icon: BookOpen,
    content: `These guidelines establish general expectations for responsible administration of Peer.Hiring. They should be reviewed as the platform evolves, new features are introduced, and operational or legal requirements change.

The administrator should ensure that actual platform policies, privacy disclosures, and enforcement procedures remain consistent with these principles.

Where these guidelines conflict with applicable law, binding obligations, or the platform's formally adopted policies, the applicable legal requirements and formal policies take precedence.

This document is an internal administrative guide. It is not a substitute for legal advice, a complete terms-of-service document, or a published privacy policy.`,
  },
];

function AdminSettings() {
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const confirmLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await adminLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(
        error?.message || "Logout failed. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const jumpToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-full bg-[#F8F9FC] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              <span>Admin</span>
              <ChevronRight size={13} />
              <span className="text-violet-700">Settings</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Admin Settings & Guidelines
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Review the rules, responsibilities, and standards for
              managing the Peer.Hiring platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLogoutError("");
              setShowLogoutModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {/* Guidelines document */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[245px_minmax(0,1fr)]">
          {/* Table of contents */}
          <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Contents
            </h2>

            <nav className="max-h-[65vh] space-y-1 overflow-y-auto">
              {guidelines.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => jumpToSection(item.id)}
                    className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-gray-600 transition hover:bg-violet-50 hover:text-violet-800"
                  >
                    <Icon
                      size={15}
                      className="mt-0.5 shrink-0 text-violet-600"
                    />
                    <span className="leading-5">{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main document */}
          <article className="min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-6 sm:px-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800">
                <BookOpen size={14} />
                ADMINISTRATION HANDBOOK
              </div>

              <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                Peer.Hiring: Rules and Regulations
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
                This handbook describes the expected standards of
                conduct for administrators responsible for maintaining
                a fair, secure, and reliable employment platform.
                Administrators should use these guidelines when
                reviewing content, managing accounts, and making
                operational decisions.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded-md border border-gray-200 px-2.5 py-1.5">
                  Internal guidelines
                </span>
                <span className="rounded-md border border-gray-200 px-2.5 py-1.5">
                  {guidelines.length} sections
                </span>
                <span className="rounded-md border border-gray-200 px-2.5 py-1.5">
                  Responsible administration
                </span>
              </div>
            </div>

            <div className="px-5 py-2 sm:px-8">
              {guidelines.map((item) => {
                const Icon = item.icon;

                return (
                  <section
                    key={item.id}
                    id={item.id}
                    className="scroll-mt-6 border-b border-gray-100 py-7 last:border-b-0"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <span className="pt-0.5 text-sm font-bold tabular-nums text-violet-600">
                        {item.number}
                      </span>

                      <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-7 text-gray-900">
                          {item.title}
                        </h3>
                      </div>

                      <Icon
                        size={19}
                        className="ml-auto mt-1 shrink-0 text-gray-400"
                      />
                    </div>

                    <div className="space-y-4 pl-0 text-[15px] leading-7 text-gray-600 sm:pl-8">
                      {item.content.split("\n\n").map((paragraph, index) => (
                        <p key={`${item.id}-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-5 py-5 sm:px-8">
              <p className="text-xs leading-6 text-gray-500">
                End of administrator guidelines. This document provides
                general internal guidance and should be aligned with
                Peer.Hiring's actual policies, implemented features,
                and applicable legal obligations.
              </p>
            </div>
          </article>
        </div>

        {/* Logout confirmation */}
        {showLogoutModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !loggingOut) {
                setShowLogoutModal(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <LogOut size={22} className="text-red-600" />
                </div>

                <button
                  type="button"
                  aria-label="Close confirmation"
                  disabled={loggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={19} />
                </button>
              </div>

              <h2
                id="logout-title"
                className="text-xl font-bold text-gray-900"
              >
                Logout from Peer.Hiring?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to sign out of your administrator
                account? You will need to log in again to access the
                admin dashboard.
              </p>

              {logoutError && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {logoutError}
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={confirmLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={16} />
                  {loggingOut ? "Logging out..." : "Yes, logout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;
