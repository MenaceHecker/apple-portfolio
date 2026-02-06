"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type ProjectId = "nexus" | "inboxiq" | "pulseforge";

type Rect = { left: number; top: number; width: number; height: number };

type SceneState = {
  activeProject: ProjectId | null;
  setActiveProject: (id: ProjectId | null) => void;

  hoverProject: ProjectId | null;
  setHoverProject: (id: ProjectId | null) => void;

  panelFrom: Rect | null;
  setPanelFrom: (r: Rect | null) => void;
};

const SceneContext = createContext<SceneState | null>(null);

export function SceneStateProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);
  const [hoverProject, setHoverProject] = useState<ProjectId | null>(null);
  const [panelFrom, setPanelFrom] = useState<Rect | null>(null);

  const value = useMemo(
    () => ({
      activeProject,
      setActiveProject,
      hoverProject,
      setHoverProject,
      panelFrom,
      setPanelFrom,
    }),
    [activeProject, hoverProject, panelFrom]
  );

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useSceneState() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useSceneState must be used inside SceneStateProvider");
  return ctx;
}
