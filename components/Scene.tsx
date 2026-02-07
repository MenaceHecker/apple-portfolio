"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Environment, PerspectiveCamera, Line, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useSceneState } from "@/components/SceneState";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ProjectId } from "@/components/SceneState";


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

const PROJECT_GRAPH: Record<ProjectId, { nodes: NodeSpec[]; flows: FlowSpec[] }> = {
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

  "mini-ml-platform": {
    nodes: [
      { id: "api", label: "FastAPI", pos: [-1.6, 0.35, 0], size: [0.95, 0.36, 0.2] },
      { id: "train", label: "Training", pos: [-0.3, 0.85, 0.1], size: [0.95, 0.4, 0.2] },
      { id: "mlflow", label: "MLflow Registry", pos: [1.25, 0.55, 0], size: [1.25, 0.44, 0.2] },
      { id: "infer", label: "Inference", pos: [0.85, -0.05, -0.1], size: [1.05, 0.42, 0.2] },
      { id: "store", label: "Artifacts", pos: [-0.6, -0.35, 0], size: [0.95, 0.36, 0.2] },
    ],
    flows: [
      { from: "api", to: "train" },
      { from: "train", to: "mlflow" },
      { from: "mlflow", to: "infer" },
      { from: "infer", to: "store" },
      { from: "api", to: "infer" },
    ],
  },

  procuroid: {
    nodes: [
      { id: "agents", label: "Agents", pos: [-1.6, 0.35, 0], size: [0.95, 0.36, 0.2] },
      { id: "gcp", label: "GCP", pos: [-0.2, 0.9, 0.1], size: [0.85, 0.38, 0.2] },
      { id: "supabase", label: "Supabase", pos: [1.35, 0.55, 0], size: [1.05, 0.42, 0.2] },
      { id: "twilio", label: "Twilio", pos: [0.95, -0.05, -0.1], size: [0.9, 0.36, 0.2] },
      { id: "voice", label: "ElevenLabs", pos: [-0.35, -0.05, 0.2], size: [1.05, 0.36, 0.2] },
    ],
    flows: [
      { from: "agents", to: "gcp" },
      { from: "gcp", to: "supabase" },
      { from: "agents", to: "twilio" },
      { from: "agents", to: "voice" },
      { from: "supabase", to: "twilio" },
    ],
  },

  movieit: {
    nodes: [
      { id: "ui", label: "Swift UI", pos: [-1.55, 0.35, 0], size: [0.95, 0.36, 0.2] },
      { id: "mvvm", label: "MVVM", pos: [-0.2, 0.9, 0.1], size: [0.85, 0.36, 0.2] },
      { id: "api", label: "REST APIs", pos: [1.35, 0.55, 0], size: [1.0, 0.4, 0.2] },
      { id: "trailers", label: "Trailers", pos: [0.9, -0.05, -0.1], size: [0.95, 0.36, 0.2] },
      { id: "book", label: "Bookings", pos: [-0.6, -0.35, 0], size: [1.0, 0.38, 0.2] },
    ],
    flows: [
      { from: "ui", to: "mvvm" },
      { from: "mvvm", to: "api" },
      { from: "api", to: "trailers" },
      { from: "api", to: "book" },
    ],
  },

  crumb: {
    nodes: [
      { id: "app", label: "React Native", pos: [-1.55, 0.35, 0], size: [1.05, 0.38, 0.2] },
      { id: "realtime", label: "Realtime Feed", pos: [-0.2, 0.9, 0.1], size: [1.05, 0.4, 0.2] },
      { id: "supabase", label: "Supabase", pos: [1.35, 0.55, 0], size: [1.0, 0.4, 0.2] },
      { id: "nfc", label: "NFC Add", pos: [0.9, -0.05, -0.1], size: [0.85, 0.34, 0.2] },
      { id: "push", label: "Push", pos: [-0.6, -0.35, 0], size: [0.75, 0.34, 0.2] },
    ],
    flows: [
      { from: "app", to: "realtime" },
      { from: "realtime", to: "supabase" },
      { from: "supabase", to: "push" },
      { from: "app", to: "nfc" },
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
      id="cursor-spotlight"
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

    hoverPull.current += ((hoverProject ? 1 : 0) - hoverPull.current) * 0.06;

    const material = m.material as THREE.MeshPhysicalMaterial;

    // base material interpolation per section
    material.roughness += (mood.current.roughness - material.roughness) * 0.04;
    material.clearcoatRoughness +=
      (mood.current.clearcoatRoughness - material.clearcoatRoughness) * 0.04;

    material.roughness += (-0.02 * hoverPull.current) * 0.02;

    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    // tension boost on hover
    const deform = mood.current.deform * (1 + hoverPull.current * 0.35);

    // directional bias toward hovered card
    const hx = hoverTarget.current.x;
    const hy = hoverTarget.current.y;

    for (let i = 0; i < pos.length; i += 3) {
      const ox = base[i];
      const oy = base[i + 1];
      const oz = base[i + 2];

      const w1 = Math.sin(ox * 2.2 + t * 1.2);
      const w2 = Math.sin(oy * 2.0 - t * 1.0);
      const w3 = Math.sin(oz * 2.4 + t * 0.9);

      const dir = ox * hx + oy * hy;
      const push = (w1 + w2 + w3) * deform + dir * 0.03 * hoverPull.current;

      const scale = 1 + push;
      pos[i] = ox * scale;
      pos[i + 1] = oy * scale;
      pos[i + 2] = oz * scale;
    }

    posAttr.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geom} material={mat} position={[0, 0, 0]} />
  );
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

function FlowAnimator({ id }: { id: ProjectId }) {
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

function ProjectExploded({ id }: { id: ProjectId }) {
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

function HoverLabel({ enabled }: { enabled: boolean }) {
  const { hoverProject, activeProject } = useSceneState();

  const ref = useRef<HTMLDivElement | null>(null);

  const cursor = useRef({ x: 50, y: 35 });
  const base = useRef({ x: 50, y: 30 });
  const pos = useRef({ x: 50, y: 30 });

  const show = enabled && !activeProject && !!hoverProject;

  const text = useMemo(() => {
    if (!hoverProject) return null;
    if (hoverProject === "nexus") return { title: "Nexus", sub: "Observability • SLOs • Grafana" };
    if (hoverProject === "inboxiq") return { title: "InboxIQ", sub: "Email OS • Search-first UX" };
    return { title: "PulseForge", sub: "Event-driven • Retries • Idempotency" };
  }, [hoverProject]);

  // Reading the spotlight vars for cursor position
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const el = document.getElementById("cursor-spotlight");
      if (el) {
        const sx = getComputedStyle(el).getPropertyValue("--sx").trim();
        const sy = getComputedStyle(el).getPropertyValue("--sy").trim();

        const cx = Number.parseFloat(sx.replace("%", "")) || 50;
        const cy = Number.parseFloat(sy.replace("%", "")) || 35;

        cursor.current.x = cx;
        cursor.current.y = cy;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Snapping the base position to the hovered card center (viewport %)
  useEffect(() => {
    if (!show || !hoverProject) return;

    const readCard = () => {
      const btn = document.querySelector(
        `[data-project="${hoverProject}"]`
      ) as HTMLElement | null;

      if (!btn) return;

      const r = btn.getBoundingClientRect();
      const cx = ((r.left + r.right) / 2 / window.innerWidth) * 100;
      const cy = ((r.top + r.bottom) / 2 / window.innerHeight) * 100;

      // placing the label slightly above the card
      base.current.x = cx;
      base.current.y = cy - 10;
    };

    readCard();

    window.addEventListener("resize", readCard, { passive: true });
    window.addEventListener("scroll", readCard, { passive: true });

    return () => {
      window.removeEventListener("resize", readCard);
      window.removeEventListener("scroll", readCard);
    };
  }, [show, hoverProject]);

  // Animate to base drift toward cursor
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const node = ref.current;

      if (!node || !show || !text) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const dx = Math.max(-5, Math.min(5, (cursor.current.x - base.current.x) * 0.16));
      const dy = Math.max(-4, Math.min(4, (cursor.current.y - base.current.y) * 0.12));

      const tx = base.current.x + dx;
      const ty = base.current.y + dy;

      pos.current.x += (tx - pos.current.x) * 0.14;
      pos.current.y += (ty - pos.current.y) * 0.14;

      node.style.left = `${pos.current.x}%`;
      node.style.top = `${pos.current.y}%`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show, text]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={ref}
        className={`absolute -translate-x-1/2 -translate-y-1/2 transition duration-200 ${
          show ? "translate-y-0" : "translate-y-1"
        }`}
        style={{ left: "50%", top: "30%" }}
      >
        <div className="rounded-2xl border border-white/14 bg-white/8 px-4 py-2 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="text-sm font-medium tracking-tight text-white/90">
            {text?.title}
          </div>
          <div className="mt-0.5 text-[11px] text-white/60">{text?.sub}</div>
        </div>
      </div>
    </div>
  );
}

function GlassSheets() {
  return (
    <group position={[0, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-0.9, 0.15, -0.2]} rotation={[0.2, 0.4, 0.1]}>
          <boxGeometry args={[1.7, 0.08, 1.1]} />
          <MeshTransmissionMaterial
            thickness={0.45}
            roughness={0.08}
            transmission={1}
            ior={1.35}
            chromaticAberration={0.03}
            anisotropy={0.2}
          />
        </mesh>
      </Float>

      <Float speed={1.0} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh position={[0.7, -0.1, -0.35]} rotation={[-0.15, -0.25, 0.05]}>
          <boxGeometry args={[1.5, 0.08, 1.0]} />
          <MeshTransmissionMaterial
            thickness={0.4}
            roughness={0.1}
            transmission={1}
            ior={1.33}
            chromaticAberration={0.025}
            anisotropy={0.15}
          />
        </mesh>
      </Float>
    </group>
  );
}

function TimelineRibbon() {
  return (
    <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.35}>
      <mesh rotation={[0.25, 0.55, 0]}>
        <torusGeometry args={[1.25, 0.06, 40, 260]} />
        <meshStandardMaterial metalness={1} roughness={0.12} color="#ffffff" />
      </mesh>
    </Float>
  );
}

function SkillsOrbit() {
  return (
    <group>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 1.6;
        return (
          <Float key={i} speed={1.1} rotationIntensity={0.4} floatIntensity={0.5}>
            <mesh position={[Math.cos(a) * r, Math.sin(a) * 0.45, Math.sin(a) * r * 0.25]}>
              <capsuleGeometry args={[0.28, 0.5, 10, 18]} />
              <meshStandardMaterial metalness={0.85} roughness={0.18} color="#ffffff" />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function ContactHalo() {
  return (
    <Float speed={0.7} rotationIntensity={0.25} floatIntensity={0.25}>
      <mesh rotation={[0.1, 0.2, 0]}>
        <torusKnotGeometry args={[1.05, 0.03, 320, 22]} />
        <meshStandardMaterial metalness={0.4} roughness={0.55} color="#ffffff" transparent opacity={0.55} />
      </mesh>
    </Float>
  );
}

function SectionModel({
  section,
  activeProject,
}: {
  section: string;
  activeProject: boolean;
}) {

  if (activeProject) return null;

  if (section === "themes") return <GlassSheets />;
  if (section === "experience") return <TimelineRibbon />;
  if (section === "skills") return <SkillsOrbit />;
  if (section === "contact") return <ContactHalo />;

  return null;
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
        activeProject
          ? "blur-[4px] brightness-75 saturate-90"
          : "blur-0 brightness-100 saturate-100"
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
          {activeProject ? (
          <ProjectExploded id={activeProject} />
            ) : (
            <>
        <HeroObject section={activeSection} />
        <SectionModel section={activeSection} activeProject={false} />
  </>
)}

        </group>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.10),transparent_55%)]" />

      <CursorSpotlight enabled={!activeProject} />
      <HoverLabel enabled={!activeProject} />


      <div
        className={`absolute inset-0 transition duration-500 ${
          activeProject ? "opacity-100" : "opacity-0"
        } bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.85)_80%)]`}
      />
    </div>
  );
}
