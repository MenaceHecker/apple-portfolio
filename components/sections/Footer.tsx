"use client";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pt-12">
      <div className="border-t border-white/10 pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/45">
            Built with Next.js, React Three Fiber, and Tailwind CSS.
          </div>

          <div className="flex items-center gap-4 text-xs text-white/45">
            <a
              href="https://github.com/MenaceHecker"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white/70 transition"
            >
              GitHub
            </a>
            <span className="opacity-30">•</span>
            <a
              href="mailto:mtushar2508@gmail.com"
              className="hover:text-white/70 transition"
            >
              Email
            </a>
            <span className="opacity-30">•</span>
            <span>© {new Date().getFullYear()} Tushar Mishra</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
