"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Environment,
  PerspectiveCamera,
  Line,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import { useSceneState } from "@/components/SceneState";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ProjectId } from "@/components/SceneState";

gsap.registerPlugin(ScrollTrigger);

// ─── types ──────────────────────────────────────────────────────────────────
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

// ─── constants ───────────────────────────────────────────────────────────────

const MATERIAL_MOODS: Record<
  string,
  { roughness: number; clearcoatRoughness: number; deform: number; color: string; envIntensity: number }
> = {
  home:       { roughness: 0.10, clearcoatRoughness: 0.05, deform: 0.032, color: "#f0f0f5", envIntensity: 1.4 },
  themes:     { roughness: 0.16, clearcoatRoughness: 0.07, deform: 0.038, color: "#f5f0ff", envIntensity: 1.2 },
  projects:   { roughness: 0.06, clearcoatRoughness: 0.02, deform: 0.018, color: "#e8f4ff", envIntensity: 1.6 },
  experience: { roughness: 0.20, clearcoatRoughness: 0.09, deform: 0.028, color: "#fff4ee", envIntensity: 1.1 },
  skills:     { roughness: 0.13, clearcoatRoughness: 0.06, deform: 0.032, color: "#edfff5", envIntensity: 1.3 },
  contact:    { roughness: 0.24, clearcoatRoughness: 0.10, deform: 0.022, color: "#f0f0ff", envIntensity: 1.0 },
};

const CAMERA_POSES: Record<
  string,
  { position: [number, number, number]; lookAt?: [number, number, number] }
> = {
  home:       { position: [0.2,  0.1,  6.2], lookAt: [0, 0, 0] },
  themes:     { position: [-0.4, 0.3,  5.6], lookAt: [0, 0, 0] },
  projects:   { position: [0.8,  -0.2, 4.6], lookAt: [0, 0, 0] },
  experience: { position: [-0.6, 0.15, 5.8], lookAt: [0, 0, 0] },
  skills:     { position: [0.4,  0.4,  5.2], lookAt: [0, 0, 0] },
  contact:    { position: [0,    0.2,  6.6], lookAt: [0, 0, 0] },
};

const PROJECT_GRAPH: Record<ProjectId, { nodes: NodeSpec[]; flows: FlowSpec[] }> = {
  nexus: {
    nodes: [
      { id: "api",  label: "Services",   pos: [-1.6, 0.3,  0],    size: [0.9,  0.35, 0.2] },
      { id: "prom", label: "Prometheus", pos: [-0.2, 0.6,  0.2],  size: [1.1,  0.45, 0.2] },
      { id: "graf", label: "Grafana",    pos: [1.2,  0.7,  0],    size: [0.9,  0.35, 0.2] },
      { id: "elk",  label: "ELK",        pos: [0.8,  -0.1, -0.1], size: [1.0,  0.45, 0.2] },
      { id: "db",   label: "Postgres",   pos: [-0.8, -0.35, 0],   size: [0.9,  0.35, 0.2] },
    ],
    flows: [
      { from: "api",  to: "prom" },
      { from: "prom", to: "graf" },
      { from: "api",  to: "elk"  },
      { from: "elk",  to: "db"   },
    ],
  },
  inboxiq: {
    nodes: [
      { id: "ui",        label: "Next.js UI",    pos: [-1.5, 0.4,  0],    size: [1.0,  0.38, 0.2] },
      { id: "auth",      label: "Auth",           pos: [-0.2, 0.8,  0.1],  size: [0.85, 0.34, 0.2] },
      { id: "providers", label: "Gmail/Outlook",  pos: [1.4,  0.5,  0],    size: [1.2,  0.42, 0.2] },
      { id: "search",    label: "Search Index",   pos: [0.9,  -0.05,-0.1], size: [1.1,  0.45, 0.2] },
      { id: "db",        label: "Prisma + DB",    pos: [-0.6, -0.35, 0],   size: [1.0,  0.4,  0.2] },
    ],
    flows: [
      { from: "ui",        to: "auth"      },
      { from: "auth",      to: "providers" },
      { from: "providers", to: "search"    },
      { from: "search",    to: "db"        },
      { from: "ui",        to: "db"        },
    ],
  },
  pulseforge: {
    nodes: [
      { id: "ingest",  label: "Ingestion",         pos: [-1.6, 0.35, 0],    size: [1.0,  0.38, 0.2] },
      { id: "queue",   label: "Event Bus",          pos: [-0.1, 0.8,  0.1],  size: [1.0,  0.4,  0.2] },
      { id: "workers", label: "Async Workers",      pos: [1.35, 0.45, 0],    size: [1.2,  0.45, 0.2] },
      { id: "retry",   label: "Retry/Idempotency",  pos: [0.9,  -0.05,-0.1], size: [1.25, 0.45, 0.2] },
      { id: "db",      label: "PostgreSQL",          pos: [-0.6, -0.35, 0],   size: [1.0,  0.4,  0.2] },
      { id: "auth",    label: "JWT/RBAC",            pos: [-0.2, -0.05, 0.2], size: [0.9,  0.34, 0.2] },
    ],
    flows: [
      { from: "auth",    to: "ingest"  },
      { from: "ingest",  to: "queue"   },
      { from: "queue",   to: "workers" },
      { from: "workers", to: "retry"   },
      { from: "retry",   to: "db"      },
    ],
  },
  "mini-ml-platform": {
    nodes: [
      { id: "api",    label: "FastAPI",         pos: [-1.6, 0.35, 0],    size: [0.95, 0.36, 0.2] },
      { id: "train",  label: "Training",        pos: [-0.3, 0.85, 0.1],  size: [0.95, 0.4,  0.2] },
      { id: "mlflow", label: "MLflow Registry", pos: [1.25, 0.55, 0],    size: [1.25, 0.44, 0.2] },
      { id: "infer",  label: "Inference",       pos: [0.85, -0.05,-0.1], size: [1.05, 0.42, 0.2] },
      { id: "store",  label: "Artifacts",       pos: [-0.6, -0.35, 0],   size: [0.95, 0.36, 0.2] },
    ],
    flows: [
      { from: "api",    to: "train"  },
      { from: "train",  to: "mlflow" },
      { from: "mlflow", to: "infer"  },
      { from: "infer",  to: "store"  },
      { from: "api",    to: "infer"  },
    ],
  },
  procuroid: {
    nodes: [
      { id: "agents",   label: "Agents",      pos: [-1.6, 0.35, 0],    size: [0.95, 0.36, 0.2] },
      { id: "gcp",      label: "GCP",          pos: [-0.2, 0.9,  0.1],  size: [0.85, 0.38, 0.2] },
      { id: "supabase", label: "Supabase",     pos: [1.35, 0.55, 0],    size: [1.05, 0.42, 0.2] },
      { id: "twilio",   label: "Twilio",       pos: [0.95, -0.05,-0.1], size: [0.9,  0.36, 0.2] },
      { id: "voice",    label: "ElevenLabs",   pos: [-0.35,-0.05, 0.2], size: [1.05, 0.36, 0.2] },
    ],
    flows: [
      { from: "agents",   to: "gcp"      },
      { from: "gcp",      to: "supabase" },
      { from: "agents",   to: "twilio"   },
      { from: "agents",   to: "voice"    },
      { from: "supabase", to: "twilio"   },
    ],
  },
  movieit: {
    nodes: [
      { id: "ui",       label: "Swift UI",  pos: [-1.55, 0.35, 0],    size: [0.95, 0.36, 0.2] },
      { id: "mvvm",     label: "MVVM",      pos: [-0.2,  0.9,  0.1],  size: [0.85, 0.36, 0.2] },
      { id: "api",      label: "REST APIs", pos: [1.35,  0.55, 0],    size: [1.0,  0.4,  0.2] },
      { id: "trailers", label: "Trailers",  pos: [0.9,   -0.05,-0.1], size: [0.95, 0.36, 0.2] },
      { id: "book",     label: "Bookings",  pos: [-0.6,  -0.35, 0],   size: [1.0,  0.38, 0.2] },
    ],
    flows: [
      { from: "ui",   to: "mvvm"     },
      { from: "mvvm", to: "api"      },
      { from: "api",  to: "trailers" },
      { from: "api",  to: "book"     },
    ],
  },
  crumb: {
    nodes: [
      { id: "app",      label: "React Native", pos: [-1.55, 0.35, 0],    size: [1.05, 0.38, 0.2] },
      { id: "realtime", label: "Realtime Feed", pos: [-0.2,  0.9,  0.1],  size: [1.05, 0.4,  0.2] },
      { id: "supabase", label: "Supabase",      pos: [1.35,  0.55, 0],    size: [1.0,  0.4,  0.2] },
      { id: "nfc",      label: "NFC Add",       pos: [0.9,   -0.05,-0.1], size: [0.85, 0.34, 0.2] },
      { id: "push",     label: "Push",          pos: [-0.6,  -0.35, 0],   size: [0.75, 0.34, 0.2] },
    ],
    flows: [
      { from: "app",      to: "realtime" },
      { from: "realtime", to: "supabase" },
      { from: "supabase", to: "push"     },
      { from: "app",      to: "nfc"      },
    ],
  },
};

// ─── shared mouse store (avoids prop-drilling) ────────────────────────────────
const mouse = { x: 0, y: 0, vx: 0, vy: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    const nx = (e.clientX / window.innerWidth)  * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.vx = nx - mouse.x;
    mouse.vy = ny - mouse.y;
    mouse.x  = nx;
    mouse.y  = ny;
  }, { passive: true });
}

// ─── CursorSpotlight ─────────────────────────────────────────────────────────
function CursorSpotlight({ enabled }: { enabled: boolean }) {
  const ref    = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 50, y: 35 });
  const pos    = useRef({ x: 50, y: 35 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth)  * 100;
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
          "radial-gradient(480px circle at var(--sx, 50%) var(--sy, 35%), rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.09) 25%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0) 65%)",
      }}
    />
  );
}

// ─── Orbiting accent lights ───────────────────────────────────────────────────
function OrbitLights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Main warm key light – orbits in XZ plane
    if (light1Ref.current) {
      light1Ref.current.position.set(
        Math.cos(t * 0.38) * 4.2,
        1.8 + Math.sin(t * 0.25) * 0.6,
        Math.sin(t * 0.38) * 4.2,
      );
      // intensity pulses very subtly with mouse speed
      const speed = Math.sqrt(mouse.vx ** 2 + mouse.vy ** 2);
      light1Ref.current.intensity = 2.2 + speed * 6;
    }

    // Cool rim light – slower counter-orbit
    if (light2Ref.current) {
      light2Ref.current.position.set(
        Math.cos(t * 0.22 + Math.PI) * 3.6,
        -1.2 + Math.cos(t * 0.18) * 0.5,
        Math.sin(t * 0.22 + Math.PI) * 3.6,
      );
    }

    // Subtle fill bounce off "floor"
    if (light3Ref.current) {
      light3Ref.current.position.set(
        mouse.x * 2.5,
        -2.8 + Math.sin(t * 0.4) * 0.3,
        2 + mouse.y * 1.5,
      );
    }
  });

  return (
    <>
      {/* warm key */}
      <pointLight ref={light1Ref} color="#ffe8c8" intensity={2.2} distance={12} decay={2} />
      {/* cool rim */}
      <pointLight ref={light2Ref} color="#a0d8ff" intensity={1.4} distance={10} decay={2} />
      {/* fill */}
      <pointLight ref={light3Ref} color="#ffffff" intensity={0.6} distance={8}  decay={2} />
    </>
  );
}

// ─── Depth particles ─────────────────────────────────────────────────────────
function DepthParticles() {
  const COUNT = 280;

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const randoms   = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
      randoms[i]           = Math.random();
    }
    return { positions, randoms };
  }, []);

  const geomRef = useRef<THREE.BufferGeometry>(null);
  const matRef  = useRef<THREE.PointsMaterial>(null);
  const posRef  = useRef(positions.slice());

  useFrame(({ clock }) => {
    if (!geomRef.current) return;
    const t    = clock.getElapsedTime();
    const attr = geomRef.current.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const r  = randoms[i];
      const ox = posRef.current[i * 3];
      const oy = posRef.current[i * 3 + 1];
      const oz = posRef.current[i * 3 + 2];

      // gentle drift
      arr[i * 3]     = ox + Math.sin(t * 0.28 * r + r * 7)   * 0.06 + mouse.x * 0.12 * r;
      arr[i * 3 + 1] = oy + Math.cos(t * 0.22 * r + r * 5)   * 0.05 + mouse.y * -0.10 * r;
      arr[i * 3 + 2] = oz + Math.sin(t * 0.18 * r + r * 3.3) * 0.04;
    }
    attr.needsUpdate = true;

    // subtle opacity breathe
    if (matRef.current) {
      matRef.current.opacity = 0.28 + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.018}
        color="#ffffff"
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── HeroObject ───────────────────────────────────────────────────────────────
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
        color:              new THREE.Color(MATERIAL_MOODS.home.color),
        metalness:          1,
        roughness:          MATERIAL_MOODS.home.roughness,
        clearcoat:          1,
        clearcoatRoughness: MATERIAL_MOODS.home.clearcoatRoughness,
        reflectivity:       1,
        envMapIntensity:    MATERIAL_MOODS.home.envIntensity,
      }),
    []
  );

  const mood        = useRef(MATERIAL_MOODS.home);
  const hoverTarget = useRef({ x: 0, y: 0 });
  const hoverPull   = useRef(0);

  // click-ripple state
  const ripple      = useRef({ active: false, phase: 0, origin: new THREE.Vector3() });

  useEffect(() => {
    mood.current = MATERIAL_MOODS[section] ?? MATERIAL_MOODS.home;
  }, [section]);

  useEffect(() => {
    if (!hoverProject) { hoverTarget.current = { x: 0, y: 0 }; return; }
    if (hoverProject === "nexus")      hoverTarget.current = { x: -0.7, y: 0.25 };
    if (hoverProject === "inboxiq")    hoverTarget.current = { x:  0.0, y: 0.35 };
    if (hoverProject === "pulseforge") hoverTarget.current = { x:  0.7, y: 0.25 };
  }, [hoverProject]);

  // Mouse click → trigger ripple
  useEffect(() => {
    const onClick = () => {
      ripple.current = {
        active: true,
        phase:  0,
        origin: new THREE.Vector3(mouse.x * 1.15, -mouse.y * 1.15, 1.15),
      };
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, []);

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;

    const t = state.clock.getElapsedTime();

    // Smooth rotation – slightly responsive to mouse velocity for feel
    m.rotation.y = t * 0.16 + mouse.vx * 0.8;
    m.rotation.x = 0.22 + Math.sin(t * 0.32) * 0.04 + mouse.vy * 0.5;

    hoverPull.current += ((hoverProject ? 1 : 0) - hoverPull.current) * 0.06;

    const material = m.material as THREE.MeshPhysicalMaterial;

    // Material interpolation
    const targetColor = new THREE.Color(mood.current.color);
    material.color.lerp(targetColor, 0.04);
    material.roughness          += (mood.current.roughness          - material.roughness)          * 0.04;
    material.clearcoatRoughness += (mood.current.clearcoatRoughness - material.clearcoatRoughness) * 0.04;
    material.envMapIntensity    += (mood.current.envIntensity        - material.envMapIntensity)    * 0.04;
    material.roughness          += (-0.02 * hoverPull.current) * 0.02;

    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const pos     = posAttr.array as Float32Array;

    const deform = mood.current.deform * (1 + hoverPull.current * 0.35);
    const hx     = hoverTarget.current.x;
    const hy     = hoverTarget.current.y;

    // Advance ripple
    if (ripple.current.active) {
      ripple.current.phase += 0.08;
      if (ripple.current.phase > Math.PI * 2) ripple.current.active = false;
    }

    for (let i = 0; i < pos.length; i += 3) {
      const ox = base[i];
      const oy = base[i + 1];
      const oz = base[i + 2];

      // Organic wave deformation
      const w1 = Math.sin(ox * 2.2 + t * 1.15);
      const w2 = Math.sin(oy * 2.0 - t * 0.95);
      const w3 = Math.sin(oz * 2.4 + t * 0.85);

      // Mouse surface influence: vertices near mouse screen direction push more
      const mouseBias = (ox * mouse.x + oy * -mouse.y) * 0.018;

      const dir  = ox * hx + oy * hy;
      let   push = (w1 + w2 + w3) * deform + dir * 0.03 * hoverPull.current + mouseBias;

      // Click ripple wave
      if (ripple.current.active) {
        const ro      = ripple.current.origin;
        const dist    = Math.sqrt((ox - ro.x) ** 2 + (oy - ro.y) ** 2 + (oz - ro.z) ** 2);
        const waveFront = ripple.current.phase * 1.2 - dist;
        if (waveFront > -0.5 && waveFront < 1.0) {
          const env = Math.max(0, 1 - Math.abs(waveFront - 0.25) / 0.75);
          push += Math.sin(waveFront * Math.PI) * 0.06 * env;
        }
      }

      const scale   = 1 + push;
      pos[i]        = ox * scale;
      pos[i + 1]    = oy * scale;
      pos[i + 2]    = oz * scale;
    }

    posAttr.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geom} material={mat} position={[0, 0, 0]} />
  );
}

// ─── Project graph helpers ────────────────────────────────────────────────────
function NodeBox({
  pos,
  size,
}: {
  pos:  [number, number, number];
  size: [number, number, number];
}) {
  const meshRef   = useRef<THREE.Mesh>(null);
  const targetY   = useRef(pos[1]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // gentle float with small mouse tilt
    meshRef.current.position.y = targetY.current + Math.sin(t * 0.9 + pos[0]) * 0.04 + mouse.y * 0.04;
    meshRef.current.rotation.x = mouse.y * 0.06;
    meshRef.current.rotation.y = mouse.x * 0.06;
  });

  return (
    <mesh ref={meshRef} position={pos}>
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        metalness={0.75}
        roughness={0.15}
        clearcoat={0.8}
        clearcoatRoughness={0.1}
        color="#e8f0ff"
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function FlowLine({
  a, b, phase,
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
      lineWidth={1.2}
      color="white"
      transparent
      opacity={0.4}
    />
  );
}

function FlowAnimator({ id }: { id: ProjectId }) {
  const spec  = PROJECT_GRAPH[id];
  const byId  = useMemo(
    () => new Map(spec.nodes.map((n) => [n.id, n.pos] as const)),
    [spec.nodes]
  );
  const phase = useRef(0);

  useFrame(() => { phase.current += 0.04; });

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

// ─── Camera rig ───────────────────────────────────────────────────────────────
function CameraRig() {
  const { activeProject } = useSceneState();
  const cameraRef   = useRef<THREE.PerspectiveCamera | null>(null);
  const springPos   = useRef({ x: 0, y: 0, _tx: 0, _ty: 0 });
  const springVel   = useRef({ x: 0, y: 0 });

  const fovRef      = useRef(45);
  const fovTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth)  * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // store raw normalised target
      springPos.current._tx = nx;
      springPos.current._ty = ny;
    };
    springPos.current._tx = 0;
    springPos.current._ty = 0;

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Spring-physics camera drift – done inside useFrame for smooth 60fps
  useFrame((_state, delta) => {
    const cam = cameraRef.current;
    if (!cam) return;

    const k     = 6.0;  // spring stiffness
    const damp  = 0.88; // damping

    const tx = springPos.current._tx ?? 0;
    const ty = springPos.current._ty ?? 0;

    // spring toward target
    springVel.current.x += (tx * 0.18 - springPos.current.x) * k * delta;
    springVel.current.y += (ty * 0.18 - springPos.current.y) * k * delta;
    springVel.current.x *= damp;
    springVel.current.y *= damp;
    springPos.current.x += springVel.current.x;
    springPos.current.y += springVel.current.y;

    cam.position.x += (springPos.current.x - cam.position.x) * 0.08;
    cam.position.y += (-springPos.current.y - cam.position.y) * 0.08;
    cam.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    const ids      = Object.keys(CAMERA_POSES);
    const triggers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const pose = CAMERA_POSES[id];
      return ScrollTrigger.create({
        trigger: el,
        start:   "top center",
        end:     "bottom center",
        onEnter:     () => { if (activeProject) return; gsap.to(cam.position, { x: pose.position[0], y: pose.position[1], z: pose.position[2], duration: 1.2, ease: "power3.out" }); },
        onEnterBack: () => { if (activeProject) return; gsap.to(cam.position, { x: pose.position[0], y: pose.position[1], z: pose.position[2], duration: 1.2, ease: "power3.out" }); },
      });
    }).filter(Boolean) as ScrollTrigger[];

    return () => triggers.forEach((t) => t.kill());
  }, [activeProject]);

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    gsap.to(cam.position, {
      x: activeProject ?  1.05 : CAMERA_POSES.home.position[0],
      y: activeProject ? -0.15 : CAMERA_POSES.home.position[1],
      z: activeProject ?  4.35 : CAMERA_POSES.home.position[2],
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

    return () => { fovTweenRef.current?.kill(); fovTweenRef.current = null; };
  }, [activeProject]);

  // Intro zoom-punch
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const runIntro = () => {
      if (activeProject) return;
      gsap.killTweensOf(cam.position);
      gsap.killTweensOf(cam);
      const z0   = cam.position.z;
      const fov0 = cam.fov;
      gsap.to(cam.position, { z: z0 - 0.22, duration: 0.18, ease: "power3.out" });
      gsap.to(cam.position, { z: z0,         duration: 0.55, delay: 0.18, ease: "power3.out" });
      gsap.to(cam, { fov: Math.max(38, fov0 - 4), duration: 0.16, ease: "power2.out", onUpdate: () => cam.updateProjectionMatrix() });
      gsap.to(cam, { fov: fov0, duration: 0.65, delay: 0.16, ease: "power3.out", onUpdate: () => cam.updateProjectionMatrix() });
    };
    window.addEventListener("tm:intro", runIntro as EventListener);
    return () => window.removeEventListener("tm:intro", runIntro as EventListener);
  }, [activeProject]);

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

// ─── Hover label ──────────────────────────────────────────────────────────────
function HoverLabel({ enabled }: { enabled: boolean }) {
  const { hoverProject, activeProject } = useSceneState();
  const ref    = useRef<HTMLDivElement | null>(null);
  const cursor = useRef({ x: 50, y: 35 });
  const base   = useRef({ x: 50, y: 30 });
  const pos    = useRef({ x: 50, y: 30 });

  const show = enabled && !activeProject && !!hoverProject;

  const text = useMemo(() => {
    if (!hoverProject) return null;
    if (hoverProject === "nexus")      return { title: "Nexus",      sub: "Observability • SLOs • Grafana" };
    if (hoverProject === "inboxiq")    return { title: "InboxIQ",    sub: "Email OS • Search-first UX" };
    return                                    { title: "PulseForge", sub: "Event-driven • Retries • Idempotency" };
  }, [hoverProject]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = document.getElementById("cursor-spotlight");
      if (el) {
        const sx = getComputedStyle(el).getPropertyValue("--sx").trim();
        const sy = getComputedStyle(el).getPropertyValue("--sy").trim();
        cursor.current.x = Number.parseFloat(sx.replace("%", "")) || 50;
        cursor.current.y = Number.parseFloat(sy.replace("%", "")) || 35;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!show || !hoverProject) return;
    const readCard = () => {
      const btn = document.querySelector(`[data-project="${hoverProject}"]`) as HTMLElement | null;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      base.current.x = ((r.left + r.right) / 2 / window.innerWidth)  * 100;
      base.current.y = ((r.top  + r.bottom) / 2 / window.innerHeight) * 100 - 10;
    };
    readCard();
    window.addEventListener("resize", readCard, { passive: true });
    window.addEventListener("scroll", readCard, { passive: true });
    return () => { window.removeEventListener("resize", readCard); window.removeEventListener("scroll", readCard); };
  }, [show, hoverProject]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const node = ref.current;
      if (!node || !show || !text) { raf = requestAnimationFrame(tick); return; }
      const dx = Math.max(-5, Math.min(5, (cursor.current.x - base.current.x) * 0.16));
      const dy = Math.max(-4, Math.min(4, (cursor.current.y - base.current.y) * 0.12));
      pos.current.x += (base.current.x + dx - pos.current.x) * 0.14;
      pos.current.y += (base.current.y + dy - pos.current.y) * 0.14;
      node.style.left = `${pos.current.x}%`;
      node.style.top  = `${pos.current.y}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show, text]);

  return (
    <div className={`pointer-events-none absolute inset-0 transition duration-200 ${show ? "opacity-100" : "opacity-0"}`}>
      <div
        ref={ref}
        className={`absolute -translate-x-1/2 -translate-y-1/2 transition duration-200 ${show ? "translate-y-0" : "translate-y-1"}`}
        style={{ left: "50%", top: "30%" }}
      >
        <div className="rounded-2xl border border-white/14 bg-white/8 px-4 py-2 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="text-sm font-medium tracking-tight text-white/90">{text?.title}</div>
          <div className="mt-0.5 text-[11px] text-white/60">{text?.sub}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Section-specific models ─────────────────────────────────────────────────

/** Themes: floating glass cards with mouse-reactive tilt */
function GlassSheets() {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mesh1.current) {
      mesh1.current.rotation.x = 0.2 + Math.sin(t * 0.5) * 0.06 + mouse.y * 0.12;
      mesh1.current.rotation.y = 0.4 + Math.cos(t * 0.4) * 0.05 + mouse.x * 0.12;
    }
    if (mesh2.current) {
      mesh2.current.rotation.x = -0.15 + Math.cos(t * 0.45) * 0.06 + mouse.y * 0.10;
      mesh2.current.rotation.y = -0.25 + Math.sin(t * 0.38) * 0.05 + mouse.x * 0.10;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.5}>
        <mesh ref={mesh1} position={[-0.9, 0.15, -0.2]}>
          <boxGeometry args={[1.7, 0.07, 1.1]} />
          <MeshTransmissionMaterial
            thickness={0.5}
            roughness={0.05}
            transmission={1}
            ior={1.38}
            chromaticAberration={0.04}
            anisotropy={0.25}
            temporalDistortion={0.08}
            distortion={0.12}
          />
        </mesh>
      </Float>
      <Float speed={1.0} rotationIntensity={0} floatIntensity={0.5}>
        <mesh ref={mesh2} position={[0.7, -0.1, -0.35]}>
          <boxGeometry args={[1.5, 0.07, 1.0]} />
          <MeshTransmissionMaterial
            thickness={0.45}
            roughness={0.07}
            transmission={1}
            ior={1.34}
            chromaticAberration={0.03}
            anisotropy={0.18}
            temporalDistortion={0.06}
            distortion={0.10}
          />
        </mesh>
      </Float>
    </group>
  );
}

/** Experience: animated torus with dynamic colour based on mouse */
function TimelineRibbon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = 0.25 + mouse.y * 0.2 + Math.sin(t * 0.3) * 0.05;
      meshRef.current.rotation.y = 0.55 + mouse.x * 0.25 + t * 0.1;
    }
    if (matRef.current) {
      // hue-shift colour over time
      const hue = (t * 10) % 360;
      matRef.current.color.setHSL(hue / 360, 0.1, 0.92);
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1.25, 0.06, 40, 260]} />
        <meshStandardMaterial
          ref={matRef}
          metalness={1}
          roughness={0.1}
          color="#ffffff"
        />
      </mesh>
    </Float>
  );
}

/** Skills: orbiting capsules with active rotation tracking mouse */
function SkillsOrbit() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.22 + mouse.x * 0.35;
    groupRef.current.rotation.x = mouse.y * 0.22;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 1.6;
        return (
          <Float key={i} speed={1.1} rotationIntensity={0.4} floatIntensity={0.5}>
            <mesh position={[Math.cos(a) * r, Math.sin(a) * 0.45, Math.sin(a) * r * 0.25]}>
              <capsuleGeometry args={[0.28, 0.5, 10, 18]} />
              <meshPhysicalMaterial
                metalness={0.9}
                roughness={0.12}
                clearcoat={1}
                clearcoatRoughness={0.08}
                color="#e0ecff"
                envMapIntensity={1.4}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

/** Contact: torus-knot halo with mouse-pulled distortion feel */
function ContactHalo() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = 0.1 + mouse.y * 0.3 + t * 0.08;
    meshRef.current.rotation.y = 0.2 + mouse.x * 0.3 + t * 0.12;
  });

  return (
    <Float speed={0.7} rotationIntensity={0} floatIntensity={0.25}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.05, 0.03, 320, 22]} />
        <meshStandardMaterial metalness={0.4} roughness={0.5} color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </Float>
  );
}

function SectionModel({ section, activeProject }: { section: string; activeProject: boolean }) {
  if (activeProject) return null;
  if (section === "themes")     return <GlassSheets />;
  if (section === "experience") return <TimelineRibbon />;
  if (section === "skills")     return <SkillsOrbit />;
  if (section === "contact")    return <ContactHalo />;
  return null;
}

// ─── Scene root ───────────────────────────────────────────────────────────────
export default function Scene() {
  const { activeProject } = useSceneState();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const ids      = Object.keys(MATERIAL_MOODS);
    const triggers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger:     el,
        start:       "top center",
        end:         "bottom center",
        onEnter:     () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    }).filter(Boolean) as ScrollTrigger[];

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
      <Canvas dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
        <CameraRig />

        {/* Base lighting */}
        <ambientLight intensity={0.18} />
        <directionalLight position={[3,  4,  2]} intensity={0.9} />
        <directionalLight position={[-4, -2, 3]} intensity={0.4} />

        {/* Dynamic orbit lights */}
        <OrbitLights />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {/* Depth particle field */}
        <DepthParticles />

        <group>
          {activeProject ? (
            <ProjectExploded id={activeProject} />
          ) : (
            <>
              <HeroObject section={activeSection} />
              <SectionModel section={activeSection} activeProject={false} />

              {/* Sparkles from drei for micro-star effect near hero */}
              <Sparkles
                count={60}
                scale={3.5}
                size={0.9}
                speed={0.25}
                opacity={0.55}
                color="#ffffff"
              />
            </>
          )}
        </group>
      </Canvas>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.08),transparent_55%)]" />

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
