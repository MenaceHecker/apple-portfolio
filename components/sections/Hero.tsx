"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="min-h-[72vh] flex flex-col justify-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xs tracking-[0.28em] text-white/60"
      >
        SOFTWARE ENGINEER • CLOUD • OBSERVABILITY
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.6 }}
        className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
      >
        Clean systems.
        <span className="text-white/70"> Quietly powerful.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.6 }}
        className="mt-5 max-w-2xl text-base leading-relaxed text-white/70"
      >
        I build production-grade platforms, automation, and reliability tooling —
        with a focus on clarity, performance, and measurable outcomes.
      </motion.p>

      <div className="mt-10 flex items-center gap-3">
        <a
          href="#projects"
          className="rounded-full bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/15"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm text-white/80 hover:text-white"
        >
          Get in touch
        </a>
      </div>

      <div className="mt-14 text-xs text-white/40">Scroll ↓</div>
    </div>
  );
}
