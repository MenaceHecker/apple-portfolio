"use client";

import { useEffect, useMemo, useState } from "react";

type NavSection = { id: string; label: string };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Navbar({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "home");
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

}