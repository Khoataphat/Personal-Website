import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsData } from '../../data/projects';
import { getAssetUrl } from '../../utils/urlHelper';
import PdfViewerModal from '../common/PdfViewerModal';
import {
  FolderKanban,
  FileText,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Layers,
  Cpu,
  Database,
  Gamepad2,
  CheckCircle2,
  Maximize2,
  Radio,
  Clock,
  Activity
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Individual 3D Interactive Project Card
function ProjectCard({ project, index, onOpenPdf }) {
  const cardRef = useRef(null);
  const [activeStarTab, setActiveStarTab] = useState('situation');
  const [transformStyle, setTransformStyle] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`);
    setSpotlightPos({ x, y });
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setIsHovered(false);
  };

  const resolvedImage = getAssetUrl(project.image);

  // Category Icon Mapping
  const getCategoryIcon = (category) => {
    if (category.includes('IoT')) return Radio;
    if (category.includes('DSA')) return Layers;
    if (category.includes('Game')) return Gamepad2;
    return Database;
  };

  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="project-card-anim group relative rounded-3xl glass-panel border border-white/10 hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(0, 242, 254, 0.12), transparent 70%)`
        }}
      />

      {/* Card Header & Media Area */}
      <div className="relative">
        {/* Project Thumbnail Image with Cyber Overlay */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-black/50">
          <img
            src={resolvedImage}
            alt={project.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
            onError={(e) => {
              // Fallback placeholder if image fails to load
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-black/60 backdrop-blur-md border border-white/15 text-primary">
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{project.category}</span>
            </div>

            <div className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-black/60 backdrop-blur-md border border-white/15 text-text-muted">
              OP 0{index + 1}
            </div>
          </div>

          {/* Quick PDF Trigger Button on Image Hover */}
          {project.reportUrl && (
            <button
              onClick={() => onOpenPdf(project.reportUrl, project.title)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/90 hover:bg-primary text-background font-mono text-xs font-semibold shadow-glow-cyan transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Quick View PDF</span>
            </button>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-7 space-y-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-text-main group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm font-mono text-text-muted mt-1">
              {project.subtitle}
            </p>
          </div>

          {/* STAR Framework Interactive Matrix */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-dim flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>STAR Architectural Breakdown</span>
              </span>
              <div className="flex gap-1">
                {['situation', 'task', 'action', 'result'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveStarTab(tab)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                      activeStarTab === tab
                        ? 'bg-primary/20 text-primary border border-primary/40 font-bold'
                        : 'text-text-dim hover:text-text-muted hover:bg-white/5'
                    }`}
                  >
                    {tab[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Active STAR Step Explanation */}
            <div className="p-3.5 rounded-2xl bg-surface-subtle/80 border border-white/5 min-h-[85px] flex flex-col justify-center">
              {activeStarTab === 'situation' && (
                <div>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                    [S] Situation / Challenge:
                  </span>
                  <p className="text-xs text-text-main mt-0.5 leading-relaxed font-light">
                    {project.star.situation}
                  </p>
                </div>
              )}
              {activeStarTab === 'task' && (
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    [T] Engineering Task:
                  </span>
                  <p className="text-xs text-text-main mt-0.5 leading-relaxed font-light">
                    {project.star.task}
                  </p>
                </div>
              )}
              {activeStarTab === 'action' && (
                <div>
                  <span className="text-[10px] font-mono text-accent-violet font-bold uppercase tracking-wider">
                    [A] Technical Action & Architecture:
                  </span>
                  <p className="text-xs text-text-main mt-0.5 leading-relaxed font-light">
                    {project.star.action}
                  </p>
                </div>
              )}
              {activeStarTab === 'result' && (
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    [R] Quantified Impact & Benchmark:
                  </span>
                  <p className="text-xs text-text-main mt-0.5 leading-relaxed font-light">
                    {project.star.result}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.techStack.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface-subtle border border-white/5 text-text-muted hover:text-text-main hover:border-white/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Hub */}
      <div className="p-6 sm:p-7 pt-0 flex flex-wrap items-center gap-3">
        {project.reportUrl && (
          <button
            onClick={() => onOpenPdf(project.reportUrl, project.title)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-background bg-primary hover:bg-primary-glow shadow-glow-cyan transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-background" />
            <span>View Report (PDF)</span>
          </button>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-medium text-text-main glass-card border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all"
            title="View Source Code on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-text-dim" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProjectsShowcase() {
  const containerRef = useRef(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPdf = (pdfUrl, title) => {
    setSelectedPdf(pdfUrl);
    setSelectedTitle(title);
    setIsModalOpen(true);
  };

  const handleClosePdf = () => {
    setIsModalOpen(false);
  };

  // GSAP ScrollTrigger Entrance Animation
  useGSAP(
    () => {
      const cards = gsap.utils.toArray('.project-card-anim');
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none"
    >
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-mono text-primary shadow-glow-cyan">
          <FolderKanban className="w-3.5 h-3.5 text-accent-cyan" />
          <span>SCENE 04 : KEY OPERATIONS</span>
          <span className="text-white/20">•</span>
          <span className="text-text-muted">FEATURED PROJECTS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-text-main">
          Applied Engineering & <span className="gradient-text-cinema">Operations</span>
        </h2>

        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
          Comprehensive project portfolio structured via the STAR method. Featuring direct technical documentation and verified GitHub repositories.
        </p>
      </div>

      {/* Projects Grid (2x2 on Desktop, 1 Column on Mobile) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onOpenPdf={handleOpenPdf}
          />
        ))}
      </div>

      {/* PDF Modal Viewer */}
      <PdfViewerModal
        isOpen={isModalOpen}
        onClose={handleClosePdf}
        pdfUrl={selectedPdf}
        projectTitle={selectedTitle}
      />
    </section>
  );
}
