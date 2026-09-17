import React, { useEffect, useRef } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import AboutStory from './AboutStory';
import TechArsenal from './TechArsenal';
import ProjectsShowcase from './ProjectsShowcase';
import BlogSection from './BlogSection';
import ContactTransmission from './ContactTransmission';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrolltellingView() {
  const containerRef = useRef(null);
  const setActiveStorySection = useCockpitStore((s) => s.setActiveStorySection);
  const targetScrollSection = useCockpitStore((s) => s.targetScrollSection);

  useEffect(() => {
    // Scroll to requested section if specified upon entering
    if (targetScrollSection) {
      const el = document.getElementById(`section-${targetScrollSection}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [targetScrollSection]);

  useEffect(() => {
    const sections = [
      { id: 'about', el: document.getElementById('section-about') },
      { id: 'skills', el: document.getElementById('section-skills') },
      { id: 'projects', el: document.getElementById('section-projects') },
      { id: 'blog', el: document.getElementById('section-blog') },
      { id: 'contact', el: document.getElementById('section-contact') },
    ];

    const triggers = sections.map(({ id, el }) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => setActiveStorySection(id),
        onEnterBack: () => setActiveStorySection(id),
      });
    }).filter(Boolean);

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [setActiveStorySection]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#070709] text-text-main overflow-x-hidden overflow-y-auto selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* ── Ambient Matrix Digital Dust & Circuit Grid ──────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 10%, rgba(0, 242, 254, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 80% 50%, rgba(247, 37, 133, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* ── Continuous Scrolltelling Sections ──────────────────────── */}
      <main className="relative z-10 w-full flex flex-col">
        {/* 1. About Storytelling Chapter Flow */}
        <section id="section-about" className="relative w-full">
          <AboutStory />
        </section>

        {/* 2. Technical Arsenal & Systems */}
        <section id="section-skills" className="relative w-full border-t border-white/5">
          <TechArsenal />
        </section>

        {/* 3. Mission Archives & Live Interactive Projects */}
        <section id="section-projects" className="relative w-full border-t border-white/5">
          <ProjectsShowcase />
        </section>

        {/* 4. Engineering Transmissions & Blogs */}
        <section id="section-blog" className="relative w-full border-t border-white/5">
          <BlogSection />
        </section>

        {/* 5. Secure Communications Terminal & Contact */}
        <section id="section-contact" className="relative w-full border-t border-white/5">
          <ContactTransmission />
        </section>
      </main>
    </div>
  );
}
