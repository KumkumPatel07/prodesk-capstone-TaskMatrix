import Link from "next/link";

const features = [
  {
    icon: "📊",
    title: "Project Management",
    description:
      "Organize projects, manage priorities and keep your entire team aligned.",
  },
  {
    icon: "✓",
    title: "Task Tracking",
    description:
      "Create tasks, assign responsibilities and track progress effortlessly.",
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    description:
      "Bring your team together and make collaboration simple and productive.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080d1a] text-white">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Task<span className="text-blue-500">Matrix</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            Your workspace, simplified
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Manage Projects.
            <br />
            <span className="text-blue-500">Empower Teams.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            TaskMatrix helps you organize projects, manage tasks and
            collaborate with your team — all from one powerful workspace.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Get Started Free →
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-gray-700 px-7 py-3.5 font-semibold text-gray-200 transition hover:border-blue-500 hover:bg-white/5"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Organize better. Collaborate smarter. Achieve more.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="rounded-2xl border border-gray-700/70 bg-[#111a2e] p-5 shadow-2xl shadow-blue-950/40">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Workspace Overview</p>
              <h2 className="mt-1 text-xl font-semibold">My Dashboard</h2>
            </div>
            <div className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
              ● Active
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-700 bg-[#172238] p-5">
              <p className="text-sm text-gray-400">Total Projects</p>
              <p className="mt-3 text-3xl font-bold">12</p>
              <p className="mt-2 text-xs text-green-400">
                Projects overview
              </p>
            </div>

            <div className="rounded-xl border border-gray-700 bg-[#172238] p-5">
              <p className="text-sm text-gray-400">Tasks Completed</p>
              <p className="mt-3 text-3xl font-bold">48</p>
              <p className="mt-2 text-xs text-blue-400">
                Track your progress
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-gray-700 bg-[#172238] p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold">Recent Tasks</h3>
              <span className="text-xs text-blue-400">View all</span>
            </div>

            {[
              ["Design Dashboard UI", "Completed", "green"],
              ["Develop Authentication", "In Progress", "blue"],
              ["Team Collaboration", "Pending", "yellow"],
            ].map(([task, status, color]) => (
              <div
                key={task}
                className="flex items-center justify-between border-t border-gray-700 py-4"
              >
                <span className="text-sm text-gray-300">{task}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    color === "green"
                      ? "bg-green-500/10 text-green-400"
                      : color === "blue"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-700">
            <div className="h-full w-[72%] rounded-full bg-blue-500"></div>
          </div>
          <p className="mt-2 text-right text-xs text-gray-400">
            Workspace progress · 72%
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-800 bg-[#0c1425] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-widest text-blue-400">
              Everything you need
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              One platform. Complete control.
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              Manage your workflow with tools designed to make teamwork
              easier and more efficient.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-800 bg-[#111a2e] p-8 transition hover:-translate-y-2 hover:border-blue-500/50"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to organize your work?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-400">
          Start managing your projects and bring your team together with
          TaskMatrix.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-500"
        >
          Create Your Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-7 text-center text-sm text-gray-500">
        © 2026 TaskMatrix. All rights reserved.
        <p className="mt-2">Built for better teamwork and productivity.</p>
      </footer>
    </main>
  );
}