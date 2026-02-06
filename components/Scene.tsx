"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Environment, PerspectiveCamera, Line } from "@react-three/drei";
import { useSceneState } from "@/components/SceneState";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MATERIAL_MOODS: Record<
  string,
  { roughness: number; clearcoatRoughness: number; deform: number }
> = {
  home: { roughness: 0.14, clearcoatRoughness: 0.06, deform: 0.035 },
  themes: { roughness: 0.18, clearcoatRoughness: 0.08, deform: 0.04 },
  projects: { roughness: 0.08, clearcoatRoughness: 0.03, deform: 0.02 },
  experience: { roughness: 0.22, clearcoatRoughness: 0.1, deform: 0.03 },
  skills: { roughness: 0.16, clearcoatRoughness: 0.07, deform: 0.035 },
  contact: { roughness: 0.28, clearcoatRoughness: 0.12, deform: 0.025 },
};

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

function CursorSpotlight({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 50, y: 35 });
  const pos = useRef({ x: 50, y: 35 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 100;
      target.current.y = (e.clientY / window.innerHeight) * 100;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const el = ref.current;

      pos.current.x += (target.current.x - pos.current.x) * 0.11;
      pos.current.y += (target.current.y - pos.current.y) * 0.11;

      if (el) {
        el.style.setProperty("--sx", `${pos.current.x}%`);
        el.style.setProperty("--sy", `${pos.current.y}%`);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 transition duration-500 ${
        enabled ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
        "radial-gradient(420px circle at var(--sx, 50%) var(--sy, 35%), rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 22%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0) 62%)",
      }}
    />
  );
}

function HeroObject({ section }: { section: string }) {
  const { hoverProject } = useSceneState();
  const meshRef = useRef<THREE.Mesh | null>(null);

  const geom = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.15, 32);
    g.computeVertexNormals();
    return g;
  }, []);

  const base = useMemo(() => {
    const pos = geom.attributes.position.array as Float32Array;
    return new Float32Array(pos);
  }, [geom]);

  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f5f5f5"),
        metalness: 1,
        roughness: MATERIAL_MOODS.home.roughness,
        clearcoat: 1,
        clearcoatRoughness: MATERIAL_MOODS.home.clearcoatRoughness,
        reflectivity: 1,
      }),
    []
  );

  const mood = useRef(MATERIAL_MOODS.home);

  const hoverTarget = useRef({ x: 0, y: 0 });
  const hoverPull = useRef(0);


  useEffect(() => {
    mood.current = MATERIAL_MOODS[section] ?? MATERIAL_MOODS.home;
  }, [section]);

  useEffect(() => {
  if (!hoverProject) {
    hoverTarget.current = { x: 0, y: 0 };
    return;
  }

  if (hoverProject === "nexus") hoverTarget.current = { x: -0.7, y: 0.25 };
  if (hoverProject === "inboxiq") hoverTarget.current = { x: 0.0, y: 0.35 };
  if (hoverProject === "pulseforge") hoverTarget.current = { x: 0.7, y: 0.25 };
}, [hoverProject]);


  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;

    const t = state.clock.getElapsedTime();

    m.rotation.y = t * 0.18;
    m.rotation.x = 0.25 + Math.sin(t * 0.35) * 0.03;

    const material = m.material as THREE.MeshPhysicalMaterial;
    material.roughness += (mood.current.roughness - material.roughness) * 0.04;
    material.clearcoatRoughness +=
      (mood.current.clearcoatRoughness - material.clearcoatRoughness) * 0.04;

    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < pos.length; i += 3) {
      const ox = base[i];
      const oy = base[i + 1];
      const oz = base[i + 2];

      const w1 = Math.sin(ox * 2.2 + t * 1.2);
      const w2 = Math.sin(oy * 2.0 - t * 1.0);
      const w3 = Math.sin(oz * 2.4 + t * 0.9);

      const push = (w1 + w2 + w3) * mood.current.deform;
      const scale = 1 + push;

      pos[i] = ox * scale;
      pos[i + 1] = oy * scale;
      pos[i + 2] = oz * scale;
    }

    posAttr.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return <mesh ref={meshRef} geometry={geom} material={mat} position={[0, 0, 0]} />;
}

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

  return <Line points={[a, mid, b]} lineWidth={1} color="white" transparent opacity={0.35} />;
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

  const fovRef = useRef(45);
  const fovTweenRef = useRef<gsap.core.Tween | null>(null);

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

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    gsap.to(cam.position, {
      x: activeProject ? 1.05 : CAMERA_POSES.home.position[0],
      y: activeProject ? -0.15 : CAMERA_POSES.home.position[1],
      z: activeProject ? 4.35 : CAMERA_POSES.home.position[2],
      duration: 0.9,
      ease: "power3.out",
    });

    fovTweenRef.current?.kill();
    fovTweenRef.current = gsap.to(fovRef, {
      current: activeProject ? 40 : 45,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => {
        const c = cameraRef.current;
        if (!c) return;
        c.fov = fovRef.current;
        c.updateProjectionMatrix();
      },
    });

    return () => {
      fovTweenRef.current?.kill();
      fovTweenRef.current = null;
    };
  }, [activeProject]);

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
    <PerspectiveCamera ref={cameraRef} makeDefault fov={45} position={[0.2, 0.1, 6.2]} near={0.1} far={100} />
  );
}

export default function Scene() {
  const { activeProject } = useSceneState();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const ids = Object.keys(MATERIAL_MOODS);

    const triggers = ids
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;

        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 transition duration-500 ${
        activeProject ? "blur-[4px] brightness-75 saturate-90" : "blur-0 brightness-100 saturate-100"
      }`}
    >
      <Canvas dpr={[1, 2]} gl={{ antialias: true }} camera={{ fov: 45 }}>
        <CameraRig />

        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 4, 2]} intensity={1.25} />
        <directionalLight position={[-4, -2, 3]} intensity={0.55} />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <group>
          {!activeProject && <HeroObject section={activeSection} />}
          {activeProject && <ProjectExploded id={activeProject} />}
        </group>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.10),transparent_55%)]" />

      <CursorSpotlight enabled={!activeProject} />

      <div
        className={`absolute inset-0 transition duration-500 ${
          activeProject ? "opacity-100" : "opacity-0"
        } bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.85)_80%)]`}
      />
    </div>
  );
}
