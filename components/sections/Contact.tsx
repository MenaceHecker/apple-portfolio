"use client";

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Contact
          </h2>

          <p className="mt-4 text-white/70">
            If you’re building backend systems, platform tooling, or cloud-native infrastructure,
            I’d love to connect.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="mailto:mtushar2508@gmail.com"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:opacity-90"
          >
            Email
          </a>

          <a
            href="https://linkedin.com/in/tushar-mishra-7960b722b"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/MenaceHecker"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            GitHub
          </a>
        </div>

        <div className="mt-10 flex items-center gap-2 text-xs text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
          <span>Based in the U.S. • Open to backend and platform roles</span>
        </div>
      </div>
    </div>
  );
}
