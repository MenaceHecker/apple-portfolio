"use client";

import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Scene from "@/components/Scene";
import Section from "@/components/Section";
import Hero from "@/components/sections/Hero";
import Themes from "@/components/sections/Themes";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import ProjectPanel from "@/components/ProjectPanel";
import { SceneStateProvider } from "@/components/SceneState";
import Footer from "@/components/sections/Footer";


export default function Page() {
  const sections = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "themes", label: "Themes" },
      { id: "projects", label: "Projects" },
      { id: "experience", label: "Experience" },
      { id: "skills", label: "Skills" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  return (
    <SceneStateProvider>
      <main className="relative min-h-screen bg-black text-white">
        <Scene />
        <Navbar sections={sections} />
        <ProjectPanel />

        <div className="relative z-10">
          <Section id="home">
            <Hero />
          </Section>

          <Section id="themes">
            <Themes />
          </Section>

          <Section id="projects">
            <Projects />
          </Section>

          <Section id="experience">
            <Experience />
          </Section>

          <Section id="skills">
            <Skills />
          </Section>

          <Section id="contact">
            <Contact />
          </Section>

          <Section id="footer">
            <Footer />
          </Section>
        </div>
      </main>
    </SceneStateProvider>
  );
}
