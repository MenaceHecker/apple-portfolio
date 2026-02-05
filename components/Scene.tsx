"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Line } from "@react-three/drei";
import { useSceneState } from "@/components/SceneState";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HeroObject() {
  return (
    <mesh position={[0, 0, 0]} rotation={[0.3, 0.4, 0]}>
      <torusKnotGeometry args={[0.7, 0.22, 220, 24]} />
      <meshStandardMaterial metalness={0.9} roughness={0.15} color="#ffffff" />
    </mesh>
  );
}

const CAMERA_POSES: Record<
  string,
  { position: [number, number, number]; lookAt?: [number, number, number] }
> = {
  home: { position: [0.2, 0.1, 6.2], lookAt: [0, 0, 0] },
  themes: { position: [-0.4, 0.3, 5.6], lookAt: [0, 0, 0] },
  projects: { position: [0.8, -0.2, 4.6], lookAt: [0, 0, 0] },
  experience: { position: [-0.6, 0.15, 5.8], lookAt: [0, 0, 0] },
  skills: { position: [0.4, 0.4, 5.2], lookAt: [0, 0, 0] },
  contact: { position: [0, 0.2, 6.6], lookAt: [0, 0, 0] },
};

type NodeSpec = {
  id: string;
  label: string;
  pos: [number, number, number];
  size: [number, number, number];
};

type FlowSpec = {
  from: string;
  to: string;
};

const PROJECT_GRAPH: Record<
  "nexus" | "inboxiq" | "pulseforge",
  { nodes: NodeSpec[]; flows: FlowSpec[] }
> = {
  nexus: {
    nodes: [
      { id: "api", label: "Services", pos: [-1.6, 0.3, 0], size: [0.9, 0.35, 0.2] },
      { id: "prom", label: "Prometheus", pos: [-0.2, 0.6, 0.2], size: [1.1, 0.45, 0.2] },
      { id: "graf", label: "Grafana", pos: [1.2, 0.7, 0], size: [0.9, 0.35, 0.2] },
      { id: "elk", label: "ELK", pos: [0.8, -0.1, -0.1], size: [1.0, 0.45, 0.2] },
      { id: "db", label: "Postgres", pos: [-0.8, -0.35, 0], size: [0.9, 0.35, 0.2] },
    ],
    flows: [
      { from: "api", to: "prom" },
      { from: "prom", to: "graf" },
      { from: "api", to: "elk" },
      { from: "elk", to: "db" },
    ],
  },

  inboxiq: {
    nodes: [
      { id: "ui", label: "Next.js UI", pos: [-1.5, 0.4, 0], size: [1.0, 0.38, 0.2] },
      { id: "auth", label: "Auth", pos: [-0.2, 0.8, 0.1], size: [0.85, 0.34, 0.2] },
      { id: "providers", label: "Gmail/Outlook", pos: [1.4, 0.5, 0], size: [1.2, 0.42, 0.2] },
      { id: "search", label: "Search Index", pos: [0.9, -0.05, -0.1], size: [1.1, 0.45, 0.2] },
      { id: "db", label: "Prisma + DB", pos: [-0.6, -0.35, 0], size: [1.0, 0.4, 0.2] },
    ],
    flows: [
      { from: "ui", to: "auth" },
      { from: "auth", to: "providers" },
      { from: "providers", to: "search" },
      { from: "search", to: "db" },
      { from: "ui", to: "db" },
    ],
  },

  pulseforge: {
    nodes: [
      { id: "ingest", label: "Ingestion", pos: [-1.6, 0.35, 0], size: [1.0, 0.38, 0.2] },
      { id: "queue", label: "Event Bus", pos: [-0.1, 0.8, 0.1], size: [1.0, 0.4, 0.2] },
      { id: "workers", label: "Async Workers", pos: [1.35, 0.45, 0], size: [1.2, 0.45, 0.2] },
      { id: "retry", label: "Retry/Idempotency", pos: [0.9, -0.05, -0.1], size: [1.25, 0.45, 0.2] },
      { id: "db", label: "PostgreSQL", pos: [-0.6, -0.35, 0], size: [1.0, 0.4, 0.2] },
      { id: "auth", label: "JWT/RBAC", pos: [-0.2, -0.05, 0.2], size: [0.9, 0.34, 0.2] },
    ],
    flows: [
      { from: "auth", to: "ingest" },
      { from: "ingest", to: "queue" },
      { from: "queue", to: "workers" },
      { from: "workers", to: "retry" },
      { from: "retry", to: "db" },
    ],
  },
};

function NodeBox({
  pos,
  size,
}: {
  pos: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial metalness={0.65} roughness={0.22} color="#ffffff" />
    </mesh>
  );
}

function FlowLine({
  a,
  b,
  phase,
}: {
  a: [number, number, number];
  b: [number, number, number];
  phase: number;
}) {
  const mid: [number, number, number] = [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2 + 0.25 + Math.sin(phase) * 0.05,
    (a[2] + b[2]) / 2,
  ];

  return (
    <Line
      points={[a, mid, b]}
      lineWidth={1}
      color="white"
      transparent
      opacity={0.35}
    />
  );
}

function FlowAnimator({ id }: { id: "nexus" | "inboxiq" | "pulseforge" }) {
  const spec = PROJECT_GRAPH[id];

  const byId = useMemo(
    () => new Map(spec.nodes.map((n) => [n.id, n.pos] as const)),
    [spec.nodes]
  );

  const phase = useRef(0);

  useFrame(() => {
    phase.current += 0.04;
  });

  return (
    <group>
      {spec.flows.map((f, idx) => (
        <FlowLine
          key={`${f.from}-${f.to}-${idx}`}
          a={byId.get(f.from)!}
          b={byId.get(f.to)!}
          phase={phase.current + idx}
        />
      ))}
    </group>
  );
}

function ProjectExploded({ id }: { id: "nexus" | "inboxiq" | "pulseforge" }) {
  const spec = PROJECT_GRAPH[id];

  return (
    <group>
      {spec.nodes.map((n) => (
        <group key={n.id}>
          <NodeBox pos={n.pos} size={n.size} />
        </group>
      ))}

      <FlowAnimator id={id} />
    </group>
  );
}

function CameraRig() {
  const { activeProject } = useSceneState();
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const target = useRef({ x: 0, y: 0 });

  // Pointer tracking
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.x = x;
      target.current.y = y;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Section-based camera poses (ONE hook, no hooks in map)
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    const ids = Object.keys(CAMERA_POSES);

    const triggers = ids
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;

        const pose = CAMERA_POSES[id];

        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            if (activeProject) return;
            gsap.to(cam.position, {
              x: pose.position[0],
              y: pose.position[1],
              z: pose.position[2],
              duration: 1.2,
              ease: "power3.out",
            });
          },
          onEnterBack: () => {
            if (activeProject) return;
            gsap.to(cam.position, {
              x: pose.position[0],
              y: pose.position[1],
              z: pose.position[2],
              duration: 1.2,
              ease: "power3.out",
            });
          },
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    return () => triggers.forEach((t) => t.kill());
  }, [activeProject]);

  // Project zoom (separate hook)
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    if (activeProject) {
      gsap.to(cam.position, {
        x: 1.05,
        y: -0.15,
        z: 4.35,
        duration: 0.9,
        ease: "power3.out",
      });
    }
  }, [activeProject]);

  // Smooth look + small parallax without fighting GSAP
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    let raf = 0;
    const tick = () => {
      cam.position.x += target.current.x * 0.002;
      cam.position.y += -target.current.y * 0.002;
      cam.lookAt(0, 0, 0);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={45}
      position={[0.2, 0.1, 6.2]}
      near={0.1}
      far={100}
    />
  );
}

export default function Scene() {
  const { activeProject } = useSceneState();

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }} camera={{ fov: 45 }}>
        <CameraRig />

        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <group>
          {!activeProject && <HeroObject />}
          {activeProject && <ProjectExploded id={activeProject} />}
        </group>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.10),transparent_55%)]" />
    </div>
  );
}
