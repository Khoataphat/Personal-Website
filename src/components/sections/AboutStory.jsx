import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Terminal,
  Cpu,
  Cloud,
  ArrowRight,
  Code2,
  GitBranch,
  Network,
  Zap,
  CheckCircle2,
  Server,
  Activity,
  Layers,
  Sparkles,
  Radio
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutStory() {
  const sectionRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const chapters = [
    {
      id: 'foundations',
      number: '01',
      tag: 'THE ORIGIN & FOUNDATION',
      title: 'Algorithmic Thinking & Computational Logic',
      subtitle: 'Where Every Line of Code Tells a Story of Problem Solving',
      desc: 'My journey began with a relentless curiosity for how software operates at the core. Deep immersion in Data Structures & Algorithms (Trees, Graphs, Dynamic Programming) forged my intuition for clean, mathematically sound logic and asymptotic efficiency.',
      highlights: [
        'Data Structures & Algorithms (DSA) problem solving',
        'Asymptotic optimization (Big-O analysis: Time & Space)',
        'Clean Code, DRY principles, and structured debugging',
        'Algorithm-driven thinking applied to practical software',
      ],
      icon: Terminal,
      accentColor: 'from-cyan-500 to-blue-600',
      badgeColor: 'border-primary/40 text-primary bg-primary/10',
      visualType: 'code',
    },
    {
      id: 'philosophy',
      number: '02',
      tag: 'ENGINEERING CORE',
      title: 'Resilient Backend Architecture & IoT Telemetry',
      subtitle: 'Bridging Object-Oriented Systems with Real-World Hardware',
      desc: 'Transitioning from theoretical algorithms to production-grade systems, I specialize in Java Object-Oriented Programming (OOP/SOLID) and real-time hardware telemetry. Seamlessly integrating backend services with IoT microcontrollers via Serial, WebSockets, and MQTT protocols.',
      highlights: [
        'Java Backend Engineering & SOLID Design Patterns',
        'Real-time IoT Telemetry & Serial / MQTT / WebSocket protocols',
        'High-reliability RESTful API development & data pipelines',
        'Event handling and robust fault-tolerant architecture',
      ],
      icon: Cpu,
      accentColor: 'from-violet-500 to-purple-600',
      badgeColor: 'border-accent-violet/40 text-accent-violet bg-accent-violet/10',
      visualType: 'iot',
    },
    {
      id: 'vision',
      number: '03',
      tag: 'FUTURE HORIZON',
      title: 'Distributed Systems & Scalable Cloud Horizons',
      subtitle: 'Engineering High-Availability and Resilient Platforms',
      desc: 'Looking forward, my vision centers on building distributed, event-driven architectures capable of handling massive concurrency. Expanding into Microservices, container orchestration with Docker & Kubernetes, and Cloud-Native reliability.',
      highlights: [
        'Distributed System Patterns & Event-Driven Architecture',
        'Microservices decomposition & asynchronous messaging',
        'Containerization (Docker, Kubernetes) & CI/CD workflows',
        'High-availability cloud infrastructure and resilience testing',
      ],
      icon: Cloud,
      accentColor: 'from-emerald-400 to-cyan-500',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      visualType: 'cloud',
    },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // DESKTOP: Horizontal Scrollytelling (>= 768px)
      mm.add('(min-width: 768px)', () => {
        const track = horizontalTrackRef.current;
        if (!track) return;

        // Calculate horizontal scroll distance (2 panels of 100vw each)
        const totalPanels = chapters.length;
        const scrollDistance = (totalPanels - 1) * 100;

        const tl = gsap.to(track, {
          xPercent: -scrollDistance * ((totalPanels - 1) / totalPanels),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${window.innerWidth * 2}`,
            onUpdate: (self) => {
              const progress = self.progress;
              setProgressPercent(Math.round(progress * 100));

              // Determine active chapter (0, 1, 2)
              const chapterIndex = Math.min(
                totalPanels - 1,
                Math.floor(progress * totalPanels + 0.15)
              );
              setActiveChapter(chapterIndex);
            },
          },
        });

        // Stagger visual entrance on each chapter card
        gsap.utils.toArray('.desktop-chapter-card').forEach((card) => {
          gsap.from(card.querySelectorAll('.chapter-content-anim'), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left center',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });

      // MOBILE: Vertical Timeline Reveal (< 768px)
      mm.add('(max-width: 767px)', () => {
        gsap.utils.toArray('.mobile-chapter-item').forEach((item) => {
          gsap.from(item, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="about" ref={sectionRef} className="relative bg-background text-text-main overflow-hidden">
      {/* Background Ambience Lines */}
      <div className="absolute inset-0 bg-cyber-dots opacity-15 pointer-events-none" />

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= 768px): Pinned Horizontal Scrollytelling                  */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative h-[100dvh] w-full overflow-hidden">
        {/* Top Floating HUD Bar */}
        <div className="absolute top-6 left-0 right-0 z-30 px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Chapter Title Badge */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full glass-panel border border-white/10 flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-text-muted">SCENE 02 :</span>
              <span className="text-primary font-semibold">THE ORIGIN & JOURNEY</span>
            </div>
          </div>

          {/* Chapter Indicator Tabs */}
          <div className="flex items-center gap-2 glass-panel p-1 rounded-full border border-white/10">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  const targetScroll = sectionRef.current.offsetTop + (idx / (chapters.length - 1)) * (window.innerWidth * 2);
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
                  activeChapter === idx
                    ? 'bg-primary/20 text-primary border border-primary/40 shadow-glow-cyan'
                    : 'text-text-muted hover:text-text-main hover:bg-white/5'
                }`}
              >
                0{idx + 1}. {ch.tag.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-3 font-mono text-xs text-text-muted glass-panel px-3.5 py-1.5 rounded-full border border-white/10">
            <span>CHAPTER</span>
            <span className="text-primary font-bold">0{activeChapter + 1}</span>
            <span>/</span>
            <span>0{chapters.length}</span>
            <span className="text-white/20">|</span>
            <span className="text-text-main font-semibold">{progressPercent}%</span>
          </div>
        </div>

        {/* Bottom Horizontal Progress Bar */}
        <div className="absolute bottom-6 left-8 right-8 z-30 max-w-7xl mx-auto pointer-events-none">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent-violet to-primary transition-all duration-150 ease-out shadow-[0_0_12px_#00f2fe]"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-text-dim">
            <span>01. FOUNDATIONS</span>
            <span>02. CORE PHILOSOPHY</span>
            <span>03. FUTURE VISION</span>
          </div>
        </div>

        {/* Horizontal Track (300vw container) */}
        <div
          ref={horizontalTrackRef}
          className="flex h-full w-[300vw] will-change-transform"
        >
          {chapters.map((chapter, index) => {
            const Icon = chapter.icon;
            return (
              <div
                key={chapter.id}
                className="desktop-chapter-card w-[100vw] h-full flex items-center justify-center px-12 lg:px-20 pt-20 pb-20"
              >
                <div className="max-w-6xl w-full grid grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Narrative Column */}
                  <div className="col-span-7 space-y-5">
                    {/* Chapter Tag & Index */}
                    <div className="chapter-content-anim inline-flex items-center gap-2.5 px-3 py-1 rounded-md text-xs font-mono tracking-wider border shadow-sm ${chapter.badgeColor}">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{chapter.tag}</span>
                      <span className="text-white/20">•</span>
                      <span className="font-bold">PART {chapter.number}</span>
                    </div>

                    {/* Chapter Headline */}
                    <h2 className="chapter-content-anim text-3xl lg:text-4xl font-display font-extrabold tracking-tight leading-tight">
                      <span className={`bg-gradient-to-r ${chapter.accentColor} bg-clip-text text-transparent`}>
                        {chapter.title}
                      </span>
                    </h2>

                    <p className="chapter-content-anim text-sm lg:text-base font-mono text-text-muted">
                      {chapter.subtitle}
                    </p>

                    <p className="chapter-content-anim text-sm lg:text-base text-text-muted leading-relaxed font-light">
                      {chapter.desc}
                    </p>

                    {/* Key Highlights Checklist */}
                    <div className="chapter-content-anim grid grid-cols-1 gap-2.5 pt-2">
                      {chapter.highlights.map((item, hIdx) => (
                        <div
                          key={hIdx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl glass-card border border-white/5 hover:border-white/15 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-text-main font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Interactive Visual Card Column */}
                  <div className="col-span-5 flex justify-center">
                    {chapter.visualType === 'code' && (
                      <div className="w-full glass-panel rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4">
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-dim">
                            <Code2 className="w-3.5 h-3.5 text-primary" />
                            <span>AlgorithmEngine.java</span>
                          </div>
                        </div>

                        {/* Code Snippet */}
                        <pre className="text-xs font-mono text-text-muted overflow-x-auto leading-relaxed p-2 bg-black/40 rounded-xl border border-white/5">
                          <code className="text-cyan-300">{`// Binary Search & Graph Flow
public int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // O(log N) Efficiency
}`}</code>
                        </pre>

                        {/* Complexity Badge */}
                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                          <div className="p-2.5 rounded-lg bg-surface-subtle border border-white/5">
                            <p className="text-[10px] text-text-dim">Time Complexity</p>
                            <p className="text-primary font-bold">O(log N)</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-surface-subtle border border-white/5">
                            <p className="text-[10px] text-text-dim">Code Quality</p>
                            <p className="text-emerald-400 font-bold">Clean & Modular</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {chapter.visualType === 'iot' && (
                      <div className="w-full glass-panel rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4">
                        {/* IoT Flow Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Radio className="w-4 h-4 text-accent-violet animate-pulse" />
                            <span className="text-xs font-mono font-semibold text-text-main">
                              Telemetry Stream
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            LIVE 115200 BAUD
                          </span>
                        </div>

                        {/* Visual Flow Topology */}
                        <div className="space-y-2.5 py-1">
                          <div className="p-3 rounded-xl bg-surface-subtle border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Server className="w-4 h-4 text-accent-violet" />
                              <div>
                                <p className="text-xs font-mono font-medium text-text-main">Java Core Backend</p>
                                <p className="text-[10px] text-text-dim">Spring Boot / WebSocket Engine</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-accent-violet">&lt;--- MQTT ---&gt;</span>
                          </div>

                          <div className="p-3 rounded-xl bg-surface-subtle border border-accent-violet/30 flex items-center justify-between shadow-glow-violet">
                            <div className="flex items-center gap-2.5">
                              <Activity className="w-4 h-4 text-primary animate-pulse" />
                              <div>
                                <p className="text-xs font-mono font-medium text-text-main">Hardware Microcontroller</p>
                                <p className="text-[10px] text-text-dim">STM32 / ESP32 Sensor Grid</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-400">SYNCED</span>
                          </div>
                        </div>

                        {/* Telemetry Metrics */}
                        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs text-center">
                          <div className="p-2 rounded-lg bg-surface-subtle border border-white/5">
                            <p className="text-[10px] text-text-dim">Latency</p>
                            <p className="text-primary font-bold">&lt; 12ms</p>
                          </div>
                          <div className="p-2 rounded-lg bg-surface-subtle border border-white/5">
                            <p className="text-[10px] text-text-dim">Packet Loss</p>
                            <p className="text-emerald-400 font-bold">0.0%</p>
                          </div>
                          <div className="p-2 rounded-lg bg-surface-subtle border border-white/5">
                            <p className="text-[10px] text-text-dim">Protocol</p>
                            <p className="text-accent-violet font-bold">Serial/WS</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {chapter.visualType === 'cloud' && (
                      <div className="w-full glass-panel rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4">
                        {/* Cloud Cluster Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                            <span className="text-xs font-mono font-semibold text-text-main">
                              Distributed Cluster
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                            HA CLUSTER
                          </span>
                        </div>

                        {/* Microservices Topology Grid */}
                        <div className="grid grid-cols-2 gap-2.5 py-1">
                          <div className="p-3 rounded-xl bg-surface-subtle border border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-semibold text-text-main">Node Cluster A</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                            <p className="text-[10px] text-text-dim">API Gateway & Auth</p>
                          </div>

                          <div className="p-3 rounded-xl bg-surface-subtle border border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-semibold text-text-main">Node Cluster B</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                            <p className="text-[10px] text-text-dim">Event Queue & Worker</p>
                          </div>
                        </div>

                        {/* Scaling Metrics */}
                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                          <div className="p-2.5 rounded-lg bg-surface-subtle border border-white/5">
                            <p className="text-[10px] text-text-dim">Target SLA Uptime</p>
                            <p className="text-emerald-400 font-bold">99.99%</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-surface-subtle border border-white/5">
                            <p className="text-[10px] text-text-dim">Architecture</p>
                            <p className="text-primary font-bold">Event-Driven</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE VIEW (< 768px): Vertical Narrative Timeline Fallback               */}
      {/* ========================================================================= */}
      <div className="md:hidden py-16 px-4 max-w-xl mx-auto space-y-12">
        {/* Mobile Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-mono text-primary shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SCENE 02 : THE ORIGIN & JOURNEY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-main">
            Engineering Evolution
          </h2>
          <p className="text-xs text-text-muted font-light leading-relaxed">
            From foundational algorithms to resilient backend architecture and scalable distributed horizons.
          </p>
        </div>

        {/* Vertical Timeline Items */}
        <div className="relative border-l-2 border-primary/30 pl-6 ml-2 space-y-12">
          {chapters.map((chapter) => {
            const Icon = chapter.icon;
            return (
              <div key={chapter.id} className="mobile-chapter-item relative space-y-4">
                {/* Timeline Dot Node */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_10px_#00f2fe] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>

                {/* Chapter Badge */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono border ${chapter.badgeColor}">
                  <Icon className="w-3.5 h-3.5" />
                  <span>CHAPTER {chapter.number}</span>
                  <span className="text-white/20">•</span>
                  <span>{chapter.tag}</span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-display font-bold text-text-main">
                  {chapter.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-light">
                  {chapter.desc}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-1">
                  {chapter.highlights.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-lg glass-card border border-white/5 text-xs text-text-main"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
