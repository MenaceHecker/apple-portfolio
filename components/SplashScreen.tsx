"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  onDone: () => void;
  durationMs?: number;
  showOncePerSession?: boolean;
};

export default function SplashScreen({
  onDone,
  durationMs = 2000,
  showOncePerSession = true,
}: Props) {
  const [visible, setVisible] = useState(false);
}

