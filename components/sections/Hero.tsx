"use client";

export default function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-24">
      <div className="max-w-3xl">
        <div className="text-sm text-white/55">Tushar Mishra</div>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Software Engineer.
          <span className="block text-white/65">
            Backend systems, cloud platforms, and reliability.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          I build cloud-native, event-driven systems and internal platforms with a focus on
          observability, performance, and production reliability.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:opacity-90"
          >
            View projects
          </a>

          <a
            href="#contact"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            Contact
          </a>

          <a
            href="https://github.com/MenaceHecker"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            GitHub
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 text-xs text-white/55">
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">
            B.S. Computer Science — GPA 3.67
          </span>
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">
            Platform & Backend Engineering
          </span>
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">
            AWS • Kubernetes • Observability
          </span>
        </div>

        <div className="mt-14 flex items-center gap-2 text-xs text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </div>
  );
}
