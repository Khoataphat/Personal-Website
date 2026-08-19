import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillsData } from '../../data/skills';
import {
  Code2,
  Terminal,
  Sparkles,
  Database,
  Layers,
  Palette,
  Server,
  Cpu,
  Radio,
  Globe,
  GitBranch,
  CheckCircle2,
  TerminalSquare,
  Box,
  Zap,
  Activity,
  Filter,
  Check
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Dynamic icon resolver
const iconMap = {
  Code2,
  Terminal,
  Sparkles,
  Database,
  Layers,
  Palette,
  Server,
  Cpu,
  Radio,
  Globe,
  GitBranch,
  CheckCircle2,
  TerminalSquare,
  Box,
  Zap,
  Activity
};

// 3D Tilt Card Sub-component
function BentoCard({ categoryData, index }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg tilt
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`);
    setSpotlightPos({ x, y });
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setIsHovered(false);
  };

  // Color schemes for individual cards
  const themeStyles = {
    languages: {
      gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
      borderHover: 'hover:border-cyan-400/50',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glowShadow: 'group-hover:shadow-[0_0_35px_rgba(0,242,254,0.15)]',
      spotlightColor: 'rgba(0, 242, 254, 0.12)',
      dotColor: 'bg-cyan-400'
    },
    frameworks: {
      gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
      borderHover: 'hover:border-violet-400/50',
      badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
      glowShadow: 'group-hover:shadow-[0_0_35px_rgba(121,40,202,0.15)]',
      spotlightColor: 'rgba(121, 40, 202, 0.14)',
      dotColor: 'bg-violet-400'
    },
    systems: {
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderHover: 'hover:border-emerald-400/50',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      glowShadow: 'group-hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]',
      spotlightColor: 'rgba(16, 185, 129, 0.12)',
      dotColor: 'bg-emerald-400'
    },
    'databases-tools': {
      gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderHover: 'hover:border-amber-400/50',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      glowShadow: 'group-hover:shadow-[0_0_35px_rgba(245,158,11,0.15)]',
      spotlightColor: 'rgba(245, 158, 11, 0.12)',
      dotColor: 'bg-amber-400'
    }
  };

  const currentTheme = themeStyles[categoryData.slug] || themeStyles.languages;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`bento-card-anim group relative rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 ${currentTheme.borderHover} ${currentTheme.glowShadow} transition-all duration-300 overflow-hidden flex flex-col justify-between`}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${currentTheme.spotlightColor}, transparent 70%)`
        }}
      />

      {/* Top Ambient Gradient */}
      <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${currentTheme.gradient} pointer-events-none`} />

      {/* Header Section */}
      <div className="relative z-10 space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${currentTheme.badgeBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.dotColor} animate-pulse`} />
            <span className="font-semibold uppercase tracking-wider">Group 0{index + 1}</span>
          </div>

          <span className="text-xs font-mono text-text-dim px-2.5 py-0.5 rounded bg-white/5 border border-white/5">
            {categoryData.skills.length} Capabilities
          </span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-text-main group-hover:text-white transition-colors">
            {categoryData.category}
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-light leading-relaxed">
            {categoryData.description}
          </p>
        </div>
      </div>

      {/* Skills Proficiency List */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {categoryData.skills.map((skill, sIdx) => {
          const IconComponent = iconMap[skill.icon] || Code2;
          return (
            <div
              key={sIdx}
              className="p-3 rounded-2xl bg-surface-subtle/80 border border-white/5 hover:border-white/20 hover:bg-surface-subtle transition-all duration-200 group/skill"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/5 text-primary group-hover/skill:text-accent-cyan group-hover/skill:bg-primary/10 transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-text-main">
                    {skill.name}
                  </span>
                </div>

                {/* Skill Level Badge */}
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                    skill.level === 'Advanced'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : skill.level === 'Proficient'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : skill.level.includes('Learning')
                      ? 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
                  {skill.level}
                </span>
              </div>

              {/* Highlight details */}
              <p className="text-[11px] text-text-muted font-light pl-1 line-clamp-2 leading-tight">
                {skill.highlight}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Micro Tech Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-text-dim">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-primary" />
          <span>Production Ready Stack</span>
        </div>
        <span className="text-white/20">|</span>
        <span className="text-text-muted group-hover:text-primary transition-colors">Verified In Projects</span>
      </div>
    </div>
  );
}

export default function TechArsenal() {
  const containerRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Arsenal', icon: Layers },
    { id: 'languages', label: 'Core Languages', icon: Code2 },
    { id: 'frameworks', label: 'Frameworks & Web', icon: Server },
    { id: 'systems', label: 'IoT & Protocols', icon: Cpu },
    { id: 'databases-tools', label: 'Databases & Tools', icon: Database },
  ];

  // GSAP ScrollTrigger Entrance Animation
  useGSAP(
    () => {
      const cards = gsap.utils.toArray('.bento-card-anim');
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        scale: 0.96,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    },
    { scope: containerRef, dependencies: [activeFilter] }
  );

  const displayedData =
    activeFilter === 'all'
      ? skillsData
      : skillsData.filter((item) => item.slug === activeFilter);

  return (
    <section
      id="arsenal"
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none"
    >
      {/* Ambient Background Grid Pattern */}
      <div className="absolute inset-0 bg-cyber-dots opacity-15 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-accent-violet/30 text-xs font-mono text-accent-violet shadow-glow-violet">
          <Zap className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
          <span>SCENE 03 : THE ARSENAL</span>
          <span className="text-white/20">•</span>
          <span className="text-text-muted">CORE CAPABILITIES</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-text-main">
          Technical <span className="gradient-text-cinema">Weaponry & Arsenal</span>
        </h2>

        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
          Structured bento grid showcasing full-stack proficiency, hardware telemetry, systems architecture, and algorithmic foundations.
        </p>

        {/* Filter Navigation Tabs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/40 shadow-glow-cyan font-semibold'
                    : 'glass-card border border-white/5 text-text-muted hover:text-text-main hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid Container */}
      <div
        className={`grid gap-6 ${
          activeFilter === 'all'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 max-w-3xl mx-auto'
        }`}
      >
        {displayedData.map((category, index) => (
          <BentoCard
            key={category.slug}
            categoryData={category}
            index={index}
          />
        ))}
      </div>

      {/* Bottom Status Banner */}
      <div className="mt-12 p-4 rounded-2xl glass-panel border border-white/10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-text-main font-medium">Continuous Evolution:</span>
          <span>Expanding into Spring Boot Microservices, Kubernetes & Event-driven Cloud</span>
        </div>
        <a
          href="#projects"
          className="flex items-center gap-1.5 text-primary hover:text-primary-glow transition-colors shrink-0"
        >
          <span>Explore Applied Projects</span>
          <span>&rarr;</span>
        </a>
      </div>
    </section>
  );
}
