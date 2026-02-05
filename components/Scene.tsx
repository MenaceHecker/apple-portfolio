"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
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

    // Scroll-driven camera rail (stub) to be expanded per section next.
    const t = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    t.to(cam.position, { z: 5.2, duration: 1 }, 0);
    t.to(cam.position, { x: 0.6, y: 0.2, duration: 1 }, 0);

    let raf = 0;
    const tick = () => {
      const px = target.current.x;
      const py = target.current.y;

      cam.position.x += (0.6 + px * 0.25 - cam.position.x) * 0.06;
      cam.position.y += (0.2 + -py * 0.18 - cam.position.y) * 0.06;
      cam.lookAt(0, 0, 0);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      t.scrollTrigger?.kill();
      t.kill();
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
      <Canvas dpr={[1, 2]}>
        <CameraRig />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
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
