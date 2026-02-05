"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type ProjectId = "nexus" | "inboxiq" | "pulseforge";

type SceneState = {
  activeProject: ProjectId | null;
  setActiveProject: (id: ProjectId | null) => void;
};

const SceneContext = createContext<SceneState | null>(null);

export function SceneStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);

  const value = useMemo(
    () => ({ activeProject, setActiveProject }),
    [activeProject]
  );

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

export function useSceneState() {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    throw new Error("useSceneState must be used inside SceneStateProvider");
  }
  return ctx;
}
