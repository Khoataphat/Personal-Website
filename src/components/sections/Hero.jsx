import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { profileData } from '../../data/profile';
import {
  Sparkles,
  Terminal,
  Layers,
  FolderKanban,
  BookOpen,
  Send,
  ArrowRight,
  FileDown,
  ArrowUpRight,
  Code2,
  Compass
} from 'lucide-react';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Hero() {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  // GSAP Kinetic Entrance Timeline
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -30,
        opacity: 0,
        scale: 0.85,
        duration: 0.8,
        delay: 0.2,
      })
        .from(
          '.hero-greeting',
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.4'
        )
        .from(
          '.hero-name-word',
          {
            y: 60,
            opacity: 0,
            rotateX: -40,
            stagger: 0.12,
            duration: 0.9,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        )
        .from(
          '.hero-role',
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          '.hero-tagline',
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          '.hero-actions',
          {
            y: 25,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
          },
          '-=0.4'
        )
        .from(
          '.hero-social-item',
          {
            y: 15,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
          },
          '-=0.5'
        )
        .from(
          '.hero-ribbon-card',
          {
            y: 35,
            opacity: 0,
            stagger: 0.08,
            duration: 0.7,
          },
          '-=0.3'
        );
    },
    { scope: containerRef }
  );

  // Interactive Mouse Spotlight
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouseCoord({ x, y });
    if (!isInside) setIsInside(true);
  };

  const handleMouseLeave = () => {
    setIsInside(false);
  };

  const nameWords = profileData.name.split(' ');

  const quickNavCards = [
    { id: '#about', title: '01. Origin', desc: 'Journey & Mindset', icon: Terminal, tag: 'DSA & OOP' },
    { id: '#arsenal', title: '02. Arsenal', desc: 'Tech Stack & Tools', icon: Layers, tag: 'Java / React' },
    { id: '#projects', title: '03. Operations', desc: 'Featured Projects', icon: FolderKanban, tag: 'STAR Case Studies' },
    { id: '#blog', title: '04. Chronicles', desc: 'Engineering Notes', icon: BookOpen, tag: 'Tech Insights' },
    { id: '#contact', title: '05. Terminal', desc: 'Open Transmission', icon: Send, tag: 'EmailJS' },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-6 pb-16 overflow-hidden select-none"
    >
      {/* Interactive Local Spotlight Effect */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-500 rounded-3xl"
        style={{
          opacity: isInside ? 1 : 0,
          background: `radial-gradient(650px circle at ${mouseCoord.x}px ${mouseCoord.y}px, rgba(0, 242, 254, 0.09), rgba(121, 40, 202, 0.04) 40%, transparent 80%)`,
        }}
      />

      {/* 1. Status Indicator Badge */}
      <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-mono text-primary mb-6 shadow-glow-cyan">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        </span>
        <span className="tracking-wide">{profileData.status}</span>
        <span className="text-white/20">|</span>
        <span className="text-text-muted hidden sm:inline">Exploring Distributed Systems & IoT</span>
      </div>

      {/* 2. Kinetic Headline */}
      <div className="max-w-4xl mx-auto">
        <p className="hero-greeting text-text-muted text-sm sm:text-lg md:text-xl font-mono font-normal tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Hello World, I am</span>
          <Sparkles className="w-4 h-4 text-primary" />
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight leading-[1.08] mb-4">
          <span className="inline-flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
            {nameWords.map((word, idx) => (
              <span
                key={idx}
                className="hero-name-word inline-block gradient-text-cinema drop-shadow-sm"
              >
                {word}
              </span>
            ))}
          </span>
        </h1>

        <div className="hero-role inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-surface-subtle/80 border border-white/10 text-primary font-mono text-sm sm:text-base font-medium mb-5">
          <Code2 className="w-4 h-4 text-accent-cyan" />
          <span>{profileData.role}</span>
        </div>

        <p className="hero-tagline text-sm sm:text-lg text-text-muted max-w-2xl mx-auto mb-9 leading-relaxed font-light">
          {profileData.tagline}
        </p>
      </div>

      {/* 3. Action Hub (CTAs & Social Connections) */}
      <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full max-w-md mx-auto">
        <a
          href="#about"
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-medium text-sm text-background bg-primary hover:bg-primary-glow shadow-glow-cyan transition-all duration-300 active:scale-95 group font-mono"
        >
          <Compass className="w-4 h-4 text-background group-hover:rotate-45 transition-transform duration-300" />
          <span>Explore The Journey</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>

        <a
          href={profileData.cvPath}
          download
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-text-main glass-card border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all duration-300 font-mono group"
        >
          <FileDown className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />
          <span>Get CV / Résumé</span>
        </a>
      </div>

      {/* Social Badges */}
      <div className="flex items-center justify-center gap-3 mb-14">
        {[
          { icon: GithubIcon, href: profileData.socials.github, label: 'GitHub' },
          { icon: LinkedinIcon, href: profileData.socials.linkedin, label: 'LinkedIn' },
          { icon: FacebookIcon, href: profileData.socials.facebook, label: 'Facebook' },
        ].map((social, idx) => {
          const Icon = social.icon;
          return (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              title={social.label}
              className="hero-social-item flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card border border-white/10 text-xs font-mono text-text-muted hover:text-primary hover:border-primary/40 hover:shadow-glow-cyan transition-all duration-300"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{social.label}</span>
              <ArrowUpRight className="w-3 h-3 text-text-dim" />
            </a>
          );
        })}
      </div>

      {/* 4. Quick Scene Navigation Ribbon */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-5xl">
        {quickNavCards.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.id}
              className="hero-ribbon-card glass-card p-3.5 sm:p-4 rounded-xl text-left border border-white/5 hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4 text-primary group-hover:scale-110 group-hover:text-accent-cyan transition-all" />
                <span className="text-[10px] font-mono text-text-dim px-1.5 py-0.5 rounded bg-white/5">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs font-mono font-semibold text-text-main group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-[11px] text-text-muted truncate mt-0.5">{item.desc}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
