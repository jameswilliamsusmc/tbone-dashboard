"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type MemorySearchResult = {
  id?: string;
  title?: string;
  content?: string;
  text?: string;
  memory?: string;
  summary?: string;
  memory_type?: string;
  type?: string;
  vault?: string;
  project_id?: string;
  project_name?: string;
  tags?: string[];
  source?: string;
  sensitivity?: string;
  confidence?: number;
  importance?: number;
  effective_date?: string;
  created_at?: string;
  updated_at?: string;
};

const formatMemoryLabel = (value?: string) => {
  if (!value) {
    return "Memory";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatMemoryDate = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const normalizeMemoryResults = (value: unknown): MemorySearchResult[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is MemorySearchResult =>
        typeof item === "object" && item !== null,
    );
  }

  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;

    for (const key of ["results", "items", "memories", "data"]) {
      if (Array.isArray(record[key])) {
        return record[key].filter(
          (item): item is MemorySearchResult =>
            typeof item === "object" && item !== null,
        );
      }
    }
  }

  return [];
};

const navItems = [
  { label: "Command Center", href: "#command-center", id: "command-center" },
  { label: "Ask T-Bone", href: "#ask-tbone", id: "ask-tbone" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Actions", href: "#actions", id: "actions" },
  { label: "Decisions", href: "#decisions", id: "decisions" },
  { label: "Memories", href: "#memories", id: "memories" },
  { label: "Vaults", href: "#vaults", id: "vaults" },
  { label: "Settings", href: "#settings", id: "settings" },
  { label: "Schedule", href: "#schedule", id: "schedule" },
];

const projects = [
  {
    name: "NGA Defender",
    subtitle: "Phase 2 Implementation",
    progress: 72,
    status: "On Track",
    statusClass: "text-emerald-300",
  },
  {
    name: "HSIN",
    subtitle: "Platform Modernization",
    progress: 58,
    status: "At Risk",
    statusClass: "text-amber-300",
  },
  {
    name: "T-Bone System Development",
    subtitle: "Core Platform and Plugins",
    progress: 65,
    status: "On Track",
    statusClass: "text-emerald-300",
  },
  {
    name: "Goodman HVAC Troubleshooting",
    subtitle: "Home System Repair",
    progress: 90,
    status: "On Track",
    statusClass: "text-emerald-300",
  },
];

const decisions = [
  {
    title: "NGA Defender — Approve Phase 2 Budget",
    detail: "$2.4M budget allocation for FY25 implementation.",
    due: "Due May 20",
    priority: "High",
    priorityClass: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  {
    title: "HSIN — Cloud Hosting Strategy",
    detail: "Choose between GovCloud and on-premises hybrid.",
    due: "Due May 21",
    priority: "High",
    priorityClass: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  {
    title: "T-Bone — Dashboard Architecture",
    detail: "Confirm Vercel front end with Railway API integration.",
    due: "Due May 23",
    priority: "Medium",
    priorityClass: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  },
];

const actions = [
  {
    title: "Review NGA Defender budget draft",
    project: "NGA Defender",
    due: "Due Today",
    dueClass: "text-amber-300",
  },
  {
    title: "Prepare HSIN risk register",
    project: "HSIN",
    due: "Due Today",
    dueClass: "text-amber-300",
  },
  {
    title: "Approve T-Bone dashboard schema",
    project: "T-Bone System Development",
    due: "May 21",
    dueClass: "text-cyan-300",
  },
  {
    title: "Replace HVAC float switch",
    project: "Goodman HVAC Troubleshooting",
    due: "May 22",
    dueClass: "text-cyan-300",
  },
  {
    title: "Send Q2 planning deck to team",
    project: "General",
    due: "May 23",
    dueClass: "text-slate-300",
  },
];

const memories = [
  {
    title: "T-Bone dashboard front end",
    detail:
      "Next.js dashboard foundation, companion imagery, projects, decisions, and actions are now working.",
    project: "T-Bone System Development",
    type: "Project Update",
    time: "Today, 10:42 AM",
    accentClass: "bg-cyan-400",
  },
  {
    title: "Railway remains the prototype host",
    detail:
      "Azure is the anticipated long-term enterprise environment for T-Bone.",
    project: "T-Bone System Development",
    type: "Decision",
    time: "Yesterday, 4:15 PM",
    accentClass: "bg-amber-400",
  },
  {
    title: "Goodman HVAC system restored",
    detail:
      "The failed contactor was replaced and all system functions are operating as designed.",
    project: "Goodman HVAC Troubleshooting",
    type: "Repair Update",
    time: "June 27, 3:30 PM",
    accentClass: "bg-emerald-400",
  },
  {
    title: "Control board replacement deferred",
    detail:
      "The new control board will remain on hand because the HVAC system is currently functioning normally.",
    project: "Goodman HVAC Troubleshooting",
    type: "Decision",
    time: "June 27, 3:24 PM",
    accentClass: "bg-violet-400",
  },
];

const vaults = [
  {
    name: "Corporate Operations",
    detail: "Leadership, staffing, contracts, and internal business records.",
    items: 128,
    status: "Secure",
    statusClass: "text-emerald-300",
  },
  {
    name: "Capture & Proposals",
    detail: "Active pursuits, proposal artifacts, teaming, and submissions.",
    items: 76,
    status: "Secure",
    statusClass: "text-emerald-300",
  },
  {
    name: "Personal Projects",
    detail: "Home, travel, music, equipment, and personal planning records.",
    items: 42,
    status: "Private",
    statusClass: "text-cyan-300",
  },
  {
    name: "T-Bone System",
    detail: "Architecture, development notes, decisions, and technical assets.",
    items: 31,
    status: "Encrypted",
    statusClass: "text-violet-300",
  },
];

const settings = [
  {
    name: "Private Mode",
    detail: "Keep personal context and memory access restricted.",
    value: "On",
    valueClass: "text-emerald-300",
  },
  {
    name: "Daily Briefing",
    detail: "Prepare a morning summary of priorities, meetings, and actions.",
    value: "Enabled",
    valueClass: "text-cyan-300",
  },
  {
    name: "Memory Capture",
    detail: "Save important project updates, decisions, and preferences.",
    value: "Automatic",
    valueClass: "text-violet-300",
  },
  {
    name: "Calendar Sync",
    detail: "Connect scheduled meetings and time-sensitive commitments.",
    value: "Pending",
    valueClass: "text-amber-300",
  },
];

const schedule = [
  {
    time: "9:00 AM",
    endTime: "9:30 AM",
    title: "Executive Operations Check-In",
    detail: "Daily priorities, staffing updates, and customer issues.",
    location: "Microsoft Teams",
    type: "Leadership",
    typeClass: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  },
  {
    time: "10:30 AM",
    endTime: "11:30 AM",
    title: "NGA Defender Program Review",
    detail: "Review funding, staffing, deliverables, and open risks.",
    location: "RiVidium HQ",
    type: "Program",
    typeClass: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
  {
    time: "1:00 PM",
    endTime: "1:45 PM",
    title: "HSIN Capture Strategy",
    detail: "Align response strategy, partner roles, and submission actions.",
    location: "Microsoft Teams",
    type: "Capture",
    typeClass: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  {
    time: "3:00 PM",
    endTime: "3:30 PM",
    title: "T-Bone Development Session",
    detail: "Continue dashboard build and front-end integration planning.",
    location: "Private Work Session",
    type: "Development",
    typeClass: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("command-center");
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [askResults, setAskResults] = useState<MemorySearchResult[]>([]);
  const [askError, setAskError] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const handleAskTbone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isAsking) {
      return;
    }

    setSubmittedQuestion(trimmedQuestion);
    setAskAnswer("");
    setAskResults([]);
    setAskError("");
    setIsAsking(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuestion }),
      });

      const data = (await response.json()) as {
        error?: string;
        query?: string;
        answer?: string;
        results?: unknown;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "T-Bone could not complete the search.");
      }

      setAskAnswer(data.answer?.trim() ?? "");
      setAskResults(normalizeMemoryResults(data.results ?? data));
      setQuestion("");
    } catch (error) {
      setAskError(
        error instanceof Error
          ? error.message
          : "T-Bone could not complete the search.",
      );
    } finally {
      setIsAsking(false);
    }
  };

  useEffect(() => {
    const groupedSectionIds = new Set([
      "projects",
      "decisions",
      "actions",
    ]);

    const standaloneSectionIds = [
      "ask-tbone",
      "memories",
      "vaults",
      "settings",
      "schedule",
    ];

    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.25;
      const pageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;

      if (pageBottom) {
        setActiveSection("schedule");
        return;
      }

      if (window.scrollY < 80) {
        setActiveSection("command-center");
        return;
      }

      const groupedSections = Array.from(groupedSectionIds)
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null);

      if (groupedSections.length > 0) {
        const groupedTop = Math.min(
          ...groupedSections.map(
            (section) => section.getBoundingClientRect().top,
          ),
        );
        const groupedBottom = Math.max(
          ...groupedSections.map(
            (section) => section.getBoundingClientRect().bottom,
          ),
        );

        if (groupedTop <= marker && groupedBottom >= marker) {
          setActiveSection((currentSection) =>
            groupedSectionIds.has(currentSection)
              ? currentSection
              : "projects",
          );
          return;
        }
      }

      for (const id of standaloneSectionIds) {
        const section = document.getElementById(id);

        if (!section) {
          continue;
        }

        const rect = section.getBoundingClientRect();

        if (rect.top <= marker && rect.bottom >= marker) {
          setActiveSection(id);
          return;
        }
      }
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-800 bg-slate-900 p-4 sm:p-6 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-wide text-cyan-400">
              T-BONE
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              AI Chief of Staff
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:block lg:space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveSection(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>

        <section
          id="command-center"
          className="min-w-0 flex-1 scroll-mt-6 p-4 sm:p-6 lg:p-8"
        >
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/tbone-companion.jpg"
                alt="T-Bone"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-cyan-400/40"
                priority
              />

              <div>
                <h2 className="text-3xl font-semibold">
                  Good morning, <span className="text-cyan-400">James.</span>
                </h2>
                <p className="mt-2 text-slate-400">
                  T-Bone is synced, informed, and ready to execute.
                </p>
              </div>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              Private Mode On
            </div>
          </header>

          <section
            id="ask-tbone"
            className="mb-8 scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h3 className="mb-4 text-xl font-medium text-cyan-300">
              Ask T-Bone
            </h3>

            <form
              onSubmit={handleAskTbone}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask anything. T-Bone has your context, projects, and memories."
                aria-label="Ask T-Bone a question"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
              />

              <button
                type="submit"
                disabled={!question.trim() || isAsking}
                className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 sm:w-auto"
              >
                {isAsking ? "Searching..." : "Send"}
              </button>
            </form>

            {submittedQuestion && (
              <div
                role="status"
                className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                  Asked T-Bone
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  {submittedQuestion}
                </p>
              </div>
            )}

            {askError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4"
              >
                <p className="text-sm font-medium text-rose-300">
                  {askError}
                </p>
              </div>
            )}

            {askAnswer && (
              <div
                role="status"
                className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950 text-sm font-semibold text-cyan-300">
                    T
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                      T-Bone Answer
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Synthesized from the strongest matching memories
                    </p>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-100">
                  {askAnswer}
                </p>
              </div>
            )}

            {askResults.length > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Live Memory Search Results
                  </p>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                    {askResults.length} result
                    {askResults.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {askResults.map((memory, index) => {
                    const body =
                      memory.content ??
                      memory.text ??
                      memory.memory ??
                      memory.summary ??
                      "No memory text was returned.";

                    const title =
                      memory.title ??
                      memory.project_name ??
                      `Memory Result ${index + 1}`;

                    const memoryType = formatMemoryLabel(
                      memory.memory_type ?? memory.type,
                    );

                    const memoryDate =
                      formatMemoryDate(memory.updated_at) ||
                      formatMemoryDate(memory.created_at) ||
                      formatMemoryDate(memory.effective_date);

                    return (
                      <article
                        key={memory.id ?? `${title}-${index}`}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="font-medium text-slate-100">
                              {title}
                            </h4>

                            {(memory.project_name || memory.vault) && (
                              <p className="mt-1 text-xs text-slate-500">
                                {memory.project_name ??
                                  formatMemoryLabel(memory.vault)}
                              </p>
                            )}
                          </div>

                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                            {memoryType}
                          </span>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                          {body}
                        </p>

                        {Array.isArray(memory.tags) &&
                          memory.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {memory.tags.slice(0, 6).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-500">
                          <span>
                            {memory.source
                              ? `Source: ${formatMemoryLabel(memory.source)}`
                              : memory.sensitivity
                                ? `Sensitivity: ${formatMemoryLabel(memory.sensitivity)}`
                                : "T-Bone memory"}
                          </span>

                          {memoryDate && <span>{memoryDate}</span>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {!isAsking &&
              submittedQuestion &&
              !askError &&
              askResults.length === 0 && (
                <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    No matching memories were found for that question.
                  </p>
                </div>
              )}
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              ["Meetings", "5", "Next: 9:00 AM"],
              ["Open Actions", "14", "3 due today"],
              ["Active Projects", "4", "2 at risk"],
              ["New Memories", "12", "Since yesterday"],
              ["Decisions", "3", "Awaiting action"],
            ].map(([label, value, detail]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
                <p className="mt-2 text-xs text-cyan-400">{detail}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
              <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950">
                <Image
                  src="/tbone-companion.jpg"
                  alt="T-Bone companion"
                  width={500}
                  height={500}
                  loading="eager"
                  className="h-64 w-full object-cover"
                />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                  T-Bone Companion
                </p>
                <h3 className="mt-3 text-2xl font-semibold">
                  Always by your side. Always working for you.
                </h3>
                <p className="mt-3 max-w-2xl text-slate-400">
                  T-Bone is your living command-center companion—watching your
                  projects, decisions, memories, and priorities so nothing
                  important slips through the cracks.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-300"
                  >
                    Plan My Day
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-200 hover:bg-slate-800"
                  >
                    Show Top Priorities
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-8 xl:grid-cols-3">
            <div
              id="projects"
              className="scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                    Portfolio
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Active Projects
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-slate-100">
                          {project.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {project.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${project.statusClass}`}
                        >
                          {project.status}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {project.progress}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-6 rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10"
              >
                + New Project
              </button>
            </div>

            <div
              id="decisions"
              className="scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                    Executive Attention
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Important Decisions
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {decisions.map((decision) => (
                  <div
                    key={decision.title}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-slate-100">
                          {decision.title}
                        </h4>
                        <p className="mt-2 text-sm text-slate-400">
                          {decision.detail}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${decision.priorityClass}`}
                      >
                        {decision.priority}
                      </span>
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                      {decision.due}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-6 rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10"
              >
                Review Decisions
              </button>
            </div>

            <div
              id="actions"
              className="scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                    Execution
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Open Actions
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {actions.map((action) => (
                  <div
                    key={action.title}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        aria-label={`Mark ${action.title} complete`}
                        className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 accent-cyan-400"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-slate-100">
                          {action.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Project: {action.project}
                        </p>
                      </div>
                      <p
                        className={`whitespace-nowrap text-xs font-medium ${action.dueClass}`}
                      >
                        {action.due}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-6 rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10"
              >
                + Add New Action
              </button>
            </div>
          </section>

          <section
            id="memories"
            className="mt-8 scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                  Persistent Memory
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Recent Memories
                </h3>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                View All Memories
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {memories.map((memory) => (
                <article
                  key={memory.title}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${memory.accentClass}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h4 className="font-medium text-slate-100">
                          {memory.title}
                        </h4>
                        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                          {memory.type}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {memory.detail}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                        <span>{memory.project}</span>
                        <span>{memory.time}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10"
            >
              Search Memory
            </button>
          </section>

          <section
            id="vaults"
            className="mt-8 scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                  Secure Knowledge
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Vaults</h3>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                Manage Vaults
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {vaults.map((vault) => (
                <article
                  key={vault.name}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-slate-100">
                        {vault.name}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {vault.detail}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium ${vault.statusClass}`}
                    >
                      {vault.status}
                    </span>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                    {vault.items} stored items
                  </p>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10"
            >
              + Create New Vault
            </button>
          </section>

          <section
            id="settings"
            className="mt-8 scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                  System Preferences
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Settings</h3>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                Manage Settings
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {settings.map((setting) => (
                <article
                  key={setting.name}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-slate-100">
                        {setting.name}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {setting.detail}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium ${setting.valueClass}`}
                    >
                      {setting.value}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10"
            >
              Open Full Settings
            </button>
          </section>

          <section
            id="schedule"
            className="mt-8 scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                  Calendar
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Today&apos;s Schedule
                </h3>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                Open Calendar
              </button>
            </div>

            <div className="space-y-4">
              {schedule.map((meeting) => (
                <article
                  key={`${meeting.time}-${meeting.title}`}
                  className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950 p-5 md:grid-cols-[110px_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-semibold text-cyan-300">
                      {meeting.time}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {meeting.endTime}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-100">
                      {meeting.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-400">
                      {meeting.detail}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {meeting.location}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${meeting.typeClass}`}
                  >
                    {meeting.type}
                  </span>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10"
            >
              + Schedule Meeting
            </button>
          </section>
        </section>
      </div>
    </main>
  );
}