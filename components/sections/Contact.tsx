"use client";

import { useMemo, useState } from "react";

export default function Contact() {
  const email = "mtushar2508@gmail.com"; 
  const links = useMemo(
    () => [
      { label: "Email", href: `mailto:${email}`, sub: email },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tushar-mishra-7960b722b/", sub: "linkedin.com/in/…" },
      { label: "GitHub", href: "https://github.com/MenaceHecker", sub: "github.com/MenaceHecker" },
    ],
    [email]
  );

  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Contact
      </h2>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="max-w-2xl">
          <div className="text-lg font-medium tracking-tight md:text-xl">
            Want to build something reliable and clean?
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
            I’m open to software engineering roles and collaborative projects.
            The fastest way to reach me is email.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${email}`}
              className="rounded-full border border-white/12 bg-white/8 px-5 py-2 text-sm text-white/85 transition hover:bg-white/12"
            >
              Email me
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="rounded-full border border-white/12 bg-white/6 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10"
            >
              {copied ? "Copied" : "Copy email"}
            </button>

            <a
              href="https://github.com/MenaceHecker"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/12 bg-white/6 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.label === "Email" ? undefined : "_blank"}
              rel={l.label === "Email" ? undefined : "noopener noreferrer"}
              className="rounded-2xl border border-white/10 bg-white/4 p-4 transition hover:bg-white/6"
            >
              <div className="text-sm font-medium text-white/85">{l.label}</div>
              <div className="mt-1 text-xs text-white/50">{l.sub}</div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-xs text-white/35">
          © {new Date().getFullYear()} Tushar Mishra
        </div>
      </div>
    </div>
  );
}
