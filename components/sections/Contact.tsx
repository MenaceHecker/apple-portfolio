"use client";

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-20 md:pb-36 md:pt-28">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Contact
        </h2>

        <p className="mt-4 text-white/65 max-w-2xl">
          Interested in backend, platform, or cloud-native roles?  
          I’m always open to discussing systems design and engineering opportunities.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
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
      </div>
    </div>
  );
}
