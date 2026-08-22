import React, { useEffect, useState, useRef } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { profileData } from '../../data/profile';
import { skillsData } from '../../data/skills';
import { projectsData } from '../../data/projects';
import { blogsData } from '../../data/blogs';
import { soundFx } from '../../services/soundFx';
import { getAssetUrl } from '../../utils/urlHelper';
import {
  User,
  Activity,
  MapPin,
  Calendar,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Radio,
  Gamepad2,
  FileText,
  ExternalLink,
  Mail,
  Send,
  CheckCircle2,
  ArrowRight,
  X,
  Code2,
  Terminal,
  Clock,
  BookOpen,
  Download,
  Share2,
  Compass
} from 'lucide-react';
import './EditorialDossier.css';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DOSSIER_TABS = [
  { id: 0, label: 'ABOUT', indexNum: '01', title: 'EXECUTIVE PROFILE & PHILOSOPHY' },
  { id: 1, label: 'SKILLS', indexNum: '02', title: 'TECHNICAL ARSENAL & SYSTEMS' },
  { id: 2, label: 'WORK', indexNum: '03', title: 'MISSION ARCHIVES & PROJECTS' },
  { id: 3, label: 'BLOG', indexNum: '04', title: 'ENGINEERING TRANSMISSIONS' },
  { id: 4, label: 'CONTACT', indexNum: '05', title: 'SECURE COMMUNICATIONS' },
];

export function EditorialDossier() {
  const isDossierOpen = useCockpitStore((s) => s.isDossierOpen);
  const activeDossierTab = useCockpitStore((s) => s.activeDossierTab);
  const closeDossier = useCockpitStore((s) => s.closeDossier);
  const switchDossierTab = useCockpitStore((s) => s.switchDossierTab);
  const openPdfModal = useCockpitStore((s) => s.openPdfModal);
  const openBlogModal = useCockpitStore((s) => s.openBlogModal);

  const containerRef = useRef(null);

  // Active STAR tab per project
  const [activeStarTabs, setActiveStarTabs] = useState({});
  // Contact form state
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Escape key and arrow keys navigation
  useEffect(() => {
    if (!isDossierOpen) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'Escape') {
        soundFx.playClose?.();
        closeDossier();
      }
      if (e.key >= '1' && e.key <= '5') {
        const targetTab = parseInt(e.key, 10) - 1;
        soundFx.playPanelSwitch?.();
        switchDossierTab(targetTab);
      }
      if (e.key === 'ArrowRight') {
        soundFx.playPanelSwitch?.();
        switchDossierTab((activeDossierTab + 1) % DOSSIER_TABS.length);
      }
      if (e.key === 'ArrowLeft') {
        soundFx.playPanelSwitch?.();
        switchDossierTab((activeDossierTab - 1 + DOSSIER_TABS.length) % DOSSIER_TABS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDossierOpen, activeDossierTab, closeDossier, switchDossierTab]);

  // Scroll to top of container when tab switches
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeDossierTab]);

  if (!isDossierOpen) return null;

  const currentTabMeta = DOSSIER_TABS[activeDossierTab] || DOSSIER_TABS[0];

  const handleStarTabClick = (projectId, step) => {
    setActiveStarTabs((prev) => ({ ...prev, [projectId]: step }));
    soundFx.playHover?.();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setCopySuccess(true);
    soundFx.playSuccess?.();
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    soundFx.playTransmission?.();
    setTimeout(() => {
      setFormState({ name: '', email: '', subject: '', message: '' });
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="editorial-backdrop fixed inset-0 z-50 flex flex-col pt-16 select-text overflow-hidden text-[#e2e8f0]">
      {/* ── Sub-Header Bar (Index + Tab Switcher + Close Button) ──────── */}
      <div className="flex-shrink-0 border-b border-white/10 bg-black/40 px-6 sm:px-12 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Section Subtitle */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]" />
          <div className="font-mono text-xs tracking-widest text-[#00f2fe]">
            INDEX // {currentTabMeta.indexNum} : <span className="text-white font-bold">{currentTabMeta.title}</span>
          </div>
        </div>

        {/* Center: Minimalist Tab Switcher */}
        <div className="hidden md:flex items-center gap-2">
          {DOSSIER_TABS.map((tab) => {
            const isActive = activeDossierTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playPanelSwitch?.();
                  switchDossierTab(tab.id);
                }}
                className={`px-3 py-1 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/50 font-bold shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.indexNum} {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right: Close Action */}
        <button
          onClick={() => {
            soundFx.playClose?.();
            closeDossier();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00f2fe]/50 text-zinc-300 hover:text-[#00f2fe] font-mono text-xs tracking-wider transition-all"
        >
          <X className="w-3.5 h-3.5" />
          <span>[ESC] RETURN TO COSMOS</span>
        </button>
      </div>

      {/* ── Main Scrollable Content Canvas ───────────────────────────── */}
      <div
        ref={containerRef}
        className="editorial-scroll flex-1 overflow-y-auto px-6 sm:px-12 md:px-20 lg:px-32 py-10 max-w-7xl mx-auto w-full"
      >
        <div key={activeDossierTab} className="editorial-tab-content space-y-12">
          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 0: ABOUT (Executive Profile & Philosophy)             */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeDossierTab === 0 && (
            <div className="space-y-12">
              {/* Editorial Lead Statement */}
              <div className="space-y-4 max-w-4xl border-b border-white/10 pb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] text-xs font-mono">
                  <Compass className="w-3.5 h-3.5" />
                  <span>CORE ARCHITECTURAL IDENTITY</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
                  Bridging resilient backend architecture with immersive spatial storytelling.
                </h1>
                <p className="text-base sm:text-lg text-zinc-300 font-sans font-light leading-relaxed">
                  {profileData.bio}
                </p>
              </div>

              {/* 2-Column Dossier Structure */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Operator Identity Specs */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="editorial-card p-6 rounded-2xl space-y-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-white font-display">{profileData.name}</div>
                        <div className="text-xs text-[#00f2fe] font-mono">{profileData.role}</div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>AVAILABLE</span>
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-xs text-zinc-300">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">// LOCATION:</span>
                        <span>{profileData.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">// TIMEZONE:</span>
                        <span>ICT (UTC+7)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">// SPECIALTY:</span>
                        <span className="text-[#00f2fe]">Distributed Systems & IoT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">// FRAMEWORK:</span>
                        <span>Java / Spring / Node / React</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => openPdfModal(profileData.cvPath, 'Pham Tuan Dang Khoa - Resume')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00f2fe] hover:bg-[#00e5ff] text-black font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,242,254,0.4)]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>VIEW RESUME (PDF)</span>
                      </button>
                      <button
                        onClick={() => switchDossierTab(4)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-mono text-xs transition-all"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#00f2fe]" />
                        <span>INITIATE TRANSMISSION</span>
                      </button>
                    </div>
                  </div>

                  {/* Core Strengths */}
                  <div className="editorial-card p-6 rounded-2xl space-y-3">
                    <div className="text-xs font-mono text-[#00f2fe] font-bold tracking-wider">// CORE STRENGTHS</div>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00f2fe] flex-shrink-0 mt-0.5" />
                        <span>High-throughput object-oriented design & SOLID design patterns.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00f2fe] flex-shrink-0 mt-0.5" />
                        <span>Sub-100ms hardware telemetry pipelines over MQTT and WebSockets.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00f2fe] flex-shrink-0 mt-0.5" />
                        <span>Relational database normalization, indexing, and transactional integrity.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column: Engineering Philosophy & Timeline */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Philosophy Pillars */}
                  <div className="space-y-4">
                    <div className="text-xs font-mono text-[#00f2fe] font-bold tracking-wider">// ARCHITECTURAL PILLARS</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="editorial-card p-4 rounded-xl space-y-2">
                        <div className="text-[#00f2fe] font-mono text-lg font-bold">01</div>
                        <div className="text-white font-bold text-sm">Resilient Backends</div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Prioritizing clean architecture, defensive coding, concurrency control, and deterministic error handling.
                        </p>
                      </div>

                      <div className="editorial-card p-4 rounded-xl space-y-2">
                        <div className="text-[#00ff88] font-mono text-lg font-bold">02</div>
                        <div className="text-white font-bold text-sm">Hardware-to-Cloud</div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Bridging microcontrollers (ESP32/ESP8266) with cloud streams for instantaneous sensory telemetry.
                        </p>
                      </div>

                      <div className="editorial-card p-4 rounded-xl space-y-2">
                        <div className="text-[#c084fc] font-mono text-lg font-bold">03</div>
                        <div className="text-white font-bold text-sm">Spatial Storytelling</div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Leveraging GPU shaders, WebGL, and micro-animations to create visceral digital brand experiences.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Career & Engineering Timeline */}
                  <div className="editorial-card p-6 rounded-2xl space-y-5">
                    <div className="text-xs font-mono text-[#00f2fe] font-bold tracking-wider">// EVOLUTIONARY TIMELINE</div>
                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex gap-4 items-start">
                        <span className="text-[#00f2fe] font-bold w-12">2022</span>
                        <div className="space-y-1">
                          <div className="text-white font-bold">Foundations in Computer Science & OOP</div>
                          <p className="text-zinc-400 font-sans font-light text-xs">
                            Deep dive into core data structures, algorithms, Java runtime internals, and software engineering principles.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <span className="text-[#00f2fe] font-bold w-12">2023</span>
                        <div className="space-y-1">
                          <div className="text-white font-bold">IoT Sensor Arrays & Real-time Telemetry</div>
                          <p className="text-zinc-400 font-sans font-light text-xs">
                            Engineered microcontroller firmwares, MQTT brokers, and WebSocket data synchronizers for automated environments.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <span className="text-[#00f2fe] font-bold w-12">2024</span>
                        <div className="space-y-1">
                          <div className="text-white font-bold">Enterprise Java, MySQL & Systems Architecture</div>
                          <p className="text-zinc-400 font-sans font-light text-xs">
                            Architected relational data schemas, secure voting cryptographic verifications, and high-performance warehouse management systems.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <span className="text-[#00f2fe] font-bold w-12">2026</span>
                        <div className="space-y-1">
                          <div className="text-white font-bold">Sovereign 3D Portfolio & Cloud Architecture</div>
                          <p className="text-zinc-400 font-sans font-light text-xs">
                            Combining full-stack backend mastery with award-winning creative WebGL storytelling.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 1: SKILLS (Technical Arsenal & Systems)                */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeDossierTab === 1 && (
            <div className="space-y-10">
              <div className="space-y-2 border-b border-white/10 pb-6">
                <div className="text-xs font-mono text-[#00f2fe] tracking-widest">// SYSTEM MATRIX</div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                  Technical Arsenal & Engineering Capabilities
                </h2>
                <p className="text-sm text-zinc-400 font-light max-w-2xl">
                  Comprehensive breakdown of programming languages, distributed backend frameworks, IoT telemetry protocols, and dev tooling.
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsData.map((category, cIdx) => (
                  <div key={cIdx} className="editorial-card p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <div className="text-xs font-mono text-[#00f2fe] tracking-wider">SYSTEM 0{cIdx + 1}</div>
                        <h3 className="text-lg font-bold text-white font-display">{category.category}</h3>
                      </div>
                      <span className="text-zinc-500 font-mono text-xs">{category.skills.length} MODULES</span>
                    </div>

                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {category.description}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {category.skills.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 rounded-xl bg-black/40 border border-white/5 hover:border-[#00f2fe]/30 transition-all flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                              <span>{skill.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 font-normal">
                                {skill.level}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-400 font-light">{skill.highlight}</div>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 2: WORK / PROJECTS (Mission Archives)                  */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeDossierTab === 2 && (
            <div className="space-y-10">
              <div className="space-y-2 border-b border-white/10 pb-6">
                <div className="text-xs font-mono text-[#00f2fe] tracking-widest">// MISSION DOSSIERS</div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                  Featured Engineering Operations & Case Studies
                </h2>
                <p className="text-sm text-zinc-400 font-light max-w-2xl">
                  Production-grade systems documented using the STAR framework, accompanied by architectural technical reports and open repositories.
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {projectsData.map((project, idx) => {
                  const resolvedImg = getAssetUrl(project.image);
                  const currentStar = activeStarTabs[project.id] || 'situation';

                  return (
                    <div key={project.id} className="editorial-card rounded-2xl overflow-hidden flex flex-col justify-between">
                      {/* Image & Header */}
                      <div>
                        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-black/60">
                          <img
                            src={resolvedImg}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e16] via-transparent to-black/40" />

                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/70 border border-white/15 text-[#00f2fe] backdrop-blur-md">
                              {project.category}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-black/70 border border-white/15 text-zinc-400">
                              OP 0{idx + 1}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-white font-display">{project.title}</h3>
                            <p className="text-xs font-mono text-[#00f2fe] mt-0.5">{project.subtitle}</p>
                          </div>

                          {/* STAR Breakdown Navigation */}
                          <div className="space-y-2.5 pt-1">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-[#00f2fe]" />
                                <span>STAR ARCHITECTURE BREAKDOWN</span>
                              </span>
                              <div className="flex gap-1">
                                {['situation', 'task', 'action', 'result'].map((step) => (
                                  <button
                                    key={step}
                                    onClick={() => handleStarTabClick(project.id, step)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                                      currentStar === step
                                        ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40 font-bold'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                    }`}
                                  >
                                    {step[0]}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* STAR Content Display */}
                            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 min-h-[75px] flex flex-col justify-center">
                              {currentStar === 'situation' && (
                                <div>
                                  <span className="text-[10px] font-mono text-[#00f2fe] font-bold uppercase">[S] SITUATION / PROBLEM:</span>
                                  <p className="text-xs text-zinc-300 mt-1 font-light leading-relaxed">{project.star.situation}</p>
                                </div>
                              )}
                              {currentStar === 'task' && (
                                <div>
                                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">[T] ENGINEERING TASK:</span>
                                  <p className="text-xs text-zinc-300 mt-1 font-light leading-relaxed">{project.star.task}</p>
                                </div>
                              )}
                              {currentStar === 'action' && (
                                <div>
                                  <span className="text-[10px] font-mono text-violet-400 font-bold uppercase">[A] TECHNICAL ARCHITECTURE:</span>
                                  <p className="text-xs text-zinc-300 mt-1 font-light leading-relaxed">{project.star.action}</p>
                                </div>
                              )}
                              {currentStar === 'result' && (
                                <div>
                                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">[R] QUANTIFIED BENCHMARK:</span>
                                  <p className="text-xs text-zinc-300 mt-1 font-light leading-relaxed">{project.star.result}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.techStack.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Hub */}
                      <div className="p-6 pt-0 flex items-center gap-3">
                        {project.reportUrl && (
                          <button
                            onClick={() => openPdfModal(project.reportUrl, `${project.title} - Technical Report`)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#00f2fe] hover:bg-[#00e5ff] text-black font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>VIEW REPORT (PDF)</span>
                          </button>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-mono text-xs transition-all"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>GITHUB</span>
                            <ExternalLink className="w-3 h-3 text-zinc-500" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 3: BLOG (Engineering Transmissions & Insights)        */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeDossierTab === 3 && (
            <div className="space-y-10">
              <div className="space-y-2 border-b border-white/10 pb-6">
                <div className="text-xs font-mono text-[#00f2fe] tracking-widest">// DATA TRANSMISSIONS</div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                  Technical Articles & Architecture Writeups
                </h2>
                <p className="text-sm text-zinc-400 font-light max-w-2xl">
                  Deep dives on Git workflows, Event-Driven concurrency, browser runtime internals, and OOP SOLID architecture.
                </p>
              </div>

              {/* Blogs List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogsData.map((blog) => (
                  <div
                    key={blog.id}
                    onClick={() => {
                      soundFx.playDockClick?.();
                      openBlogModal(blog);
                    }}
                    className="editorial-card p-6 rounded-2xl space-y-4 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span className="px-2.5 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white font-display group-hover:text-[#00f2fe] transition-colors leading-snug">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-zinc-400 font-light line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10 font-mono text-xs">
                      <div className="flex gap-1.5">
                        {blog.tags.slice(0, 3).map((tag, tIdx) => (
                          <span key={tIdx} className="text-zinc-500">#{tag}</span>
                        ))}
                      </div>
                      <span className="text-[#00f2fe] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>READ LOG</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 4: CONTACT (Secure Communications Terminal)           */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeDossierTab === 4 && (
            <div className="space-y-10">
              <div className="space-y-2 border-b border-white/10 pb-6">
                <div className="text-xs font-mono text-[#00f2fe] tracking-widest">// TRANSMISSION LINK</div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                  Initiate Direct Communication Channel
                </h2>
                <p className="text-sm text-zinc-400 font-light max-w-2xl">
                  Send a transmission directly or connect via encrypted channels, GitHub, or LinkedIn.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Contact Info & Channels */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="editorial-card p-6 rounded-2xl space-y-5">
                    <div className="text-xs font-mono text-[#00f2fe] font-bold tracking-wider">// DIRECT FREQUENCIES</div>

                    {/* Email Copy Card */}
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                      <div className="text-[11px] font-mono text-zinc-400">// PRIMARY EMAIL:</div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-white font-bold truncate">{profileData.email}</span>
                        <button
                          onClick={handleCopyEmail}
                          className="px-2.5 py-1 rounded bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 text-[#00f2fe] font-mono text-[11px] transition-colors"
                        >
                          {copySuccess ? 'COPIED!' : 'COPY'}
                        </button>
                      </div>
                    </div>

                    {/* Social Network Hub */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-zinc-400">// VERIFIED NETWORK NODES:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={profileData.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                        >
                          <GithubIcon className="w-3.5 h-3.5 text-[#00f2fe]" />
                          <span>GITHUB</span>
                        </a>

                        <a
                          href={profileData.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5 text-[#00f2fe]" />
                          <span>LINKEDIN</span>
                        </a>
                      </div>
                    </div>

                    {/* Resume Quick Access */}
                    <div className="pt-2">
                      <button
                        onClick={() => openPdfModal(profileData.cvPath, 'Pham Tuan Dang Khoa - Resume')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-[#00f2fe]" />
                        <span>DOWNLOAD CURRICULUM VITAE (PDF)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Direct Transmission Form */}
                <div className="lg:col-span-7">
                  <form onSubmit={handleFormSubmit} className="editorial-card p-6 sm:p-8 rounded-2xl space-y-4">
                    <div className="text-xs font-mono text-[#00f2fe] font-bold tracking-wider">// SECURE TRANSMISSION DISPATCH</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-zinc-400">YOUR IDENTITY (NAME) *</label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="e.g. Elena Vance"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#00f2fe] focus:outline-none font-mono text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-zinc-400">RETURN ADDRESS (EMAIL) *</label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="elena@domain.io"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#00f2fe] focus:outline-none font-mono text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400">SUBJECT / PROJECT SCOPE</label>
                      <input
                        type="text"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        placeholder="Backend Engineering Opportunity / IoT Collaboration"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#00f2fe] focus:outline-none font-mono text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400">ENCRYPTED MESSAGE BODY *</label>
                      <textarea
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Detail your engineering requirements, project architecture, or recruitment inquiry..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#00f2fe] focus:outline-none font-mono text-xs text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSent}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                        isSent
                          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-[#00f2fe] hover:bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>TRANSMISSION DISPATCHED SUCCESSFULLY!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>DISPATCH TRANSMISSION</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
