import React from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import CustomCursor from './components/common/CustomCursor';
import GlowMesh from './components/background/GlowMesh';
import ParticleField from './components/background/ParticleField';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Hero from './components/sections/Hero';
import AboutStory from './components/sections/AboutStory';
import TechArsenal from './components/sections/TechArsenal';
import ProjectsShowcase from './components/sections/ProjectsShowcase';
import BlogSection from './components/sections/BlogSection';
import ContactTransmission from './components/sections/ContactTransmission';

export default function App() {
  useSmoothScroll();

  return (
    <div className="relative min-h-screen bg-background text-text-main overflow-hidden flex flex-col justify-between selection:bg-primary selection:text-background">
      {/* Dynamic Visual FX */}
      <CustomCursor />
      <GlowMesh />
      <ParticleField />

      {/* Main Header / Navigation */}
      <Navbar />

      {/* Content Container */}
      <main className="relative z-10 flex-grow pt-20">
        {/* Scene 1: The Prologue (Hero Section) */}
        <Hero />

        {/* Scene 2: The Origin & Journey (About Scrollytelling) */}
        <AboutStory />

        {/* Scene 3: The Arsenal (Tech Stack Bento Grid) */}
        <TechArsenal />

        {/* Scene 4: Key Operations (Featured Projects Showcase) */}
        <ProjectsShowcase />

        {/* Scene 5: The Chronicles (Engineering Tech Notes) */}
        <BlogSection />

        {/* Scene 6: Transmission Terminal (Contact & CV Download) */}
        <ContactTransmission />
      </main>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
