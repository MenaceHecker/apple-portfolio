"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Line } from "@react-three/drei";
import { useSceneState } from "@/components/SceneState";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

function HeroObject() {
  return (
    <mesh position={[0, 0, 0]} rotation={[0.3, 0.4, 0]}>
      <torusKnotGeometry args={[0.7, 0.22, 220, 24]} />
      <meshStandardMaterial
        metalness={0.9}
        roughness={0.15}
        color={"#ffffff"}
      />
    </mesh>
  );
}
const CAMERA_POSES: Record<
  string,
  { position: [number, number, number]; lookAt?: [number, number, number] }
> = {
  home: {
    position: [0.2, 0.1, 6.2],
    lookAt: [0, 0, 0],
  },
  themes: {
    position: [-0.4, 0.3, 5.6],
    lookAt: [0, 0, 0],
  },
  projects: {
    position: [0.8, -0.2, 4.6],
    lookAt: [0, 0, 0],
  },
  experience: {
    position: [-0.6, 0.15, 5.8],
    lookAt: [0, 0, 0],
  },
  skills: {
    position: [0.4, 0.4, 5.2],
    lookAt: [0, 0, 0],
  },
  contact: {
    position: [0, 0.2, 6.6],
    lookAt: [0, 0, 0],
  },
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
      { from: "ingest", to: "queue" },
      { from: "queue", to: "workers" },
      { from: "workers", to: "retry" },
      { from: "retry", to: "db" },
      { from: "auth", to: "ingest" },
    ],
  },
};


function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const target = useRef({ x: 0, y: 0 });

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

  const sections = Object.keys(CAMERA_POSES);

  const triggers = sections.map((id) => {
    const el = document.getElementById(id);
    if (!el) return null;

    const pose = CAMERA_POSES[id];

    return ScrollTrigger.create({
      trigger: el,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        gsap.to(cam.position, {
          x: pose.position[0],
          y: pose.position[1],
          z: pose.position[2],
          duration: 1.2,
          ease: "power3.out",
        });
      },
      onEnterBack: () => {
        gsap.to(cam.position, {
          x: pose.position[0],
          y: pose.position[1],
          z: pose.position[2],
          duration: 1.2,
          ease: "power3.out",
        });
      },
    });
  });

  let raf = 0;
  const tick = () => {
    const px = target.current.x;
    const py = target.current.y;

    cam.position.x += px * 0.015;
    cam.position.y += -py * 0.015;
    cam.lookAt(0, 0, 0);

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    triggers.forEach((t) => t?.kill());
    cancelAnimationFrame(raf);
  };
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
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }} camera={{ fov: 45 }}>
        <CameraRig />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} />
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        <HeroObject />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.10),transparent_55%)]" />
    </div>
  );
}
