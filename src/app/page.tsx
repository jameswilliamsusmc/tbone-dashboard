import Image from "next/image";

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
        </section>
      </div>
    </main>
  );
}