import Image from "next/image";

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

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-wide text-cyan-400">
              T-BONE
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              AI Chief of Staff
            </p>
          </div>

          <nav className="space-y-2">
            {[
              "Command Center",
              "Ask T-Bone",
              "Projects",
              "Actions",
              "Decisions",
              "Memories",
              "Vaults",
              "Settings",
            ].map((item, index) => (
              <button
                key={item}
                type="button"
                className={`w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                  index === 0
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <header className="mb-8 flex items-start justify-between">
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
                  Good morning,{" "}
                  <span className="text-cyan-400">James.</span>
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

          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-medium text-cyan-300">
              Ask T-Bone
            </h3>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask anything. T-Bone has your context, projects, and memories."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
              />

              <button
                type="button"
                className="rounded-xl bg-cyan-400 px-6 font-medium text-slate-950 hover:bg-cyan-300"
              >
                Send
              </button>
            </div>
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
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
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

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
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

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                    Execution
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">Open Actions</h3>
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

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
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
        </section>
      </div>
    </main>
  );
}