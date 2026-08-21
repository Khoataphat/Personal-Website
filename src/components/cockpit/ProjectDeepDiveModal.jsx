import React, { useState, useEffect } from 'react';
import { projectsData } from '../../data/projects';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { CyberBlueprint } from './CyberBlueprint';
import { X, ExternalLink, FileText, Eye, Layers, Activity } from 'lucide-react';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function ProjectDeepDiveModal() {
  const activeProjectId = useCockpitStore((s) => s.activeProjectModal);
  const closeProjectModal = useCockpitStore((s) => s.closeProjectModal);
  const openPdfModal = useCockpitStore((s) => s.openPdfModal);

  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'blueprint'

  // Find project
  const project = projectsData.find((p) => p.id === activeProjectId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
    };
    if (activeProjectId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectId, closeProjectModal]);

  if (!activeProjectId || !project) return null;

  const handleClose = () => {
    soundFx.playToggle();
    closeProjectModal();
  };

  const handleTabSwitch = (tab) => {
    soundFx.playChirp();
    setActiveTab(tab);
  };

  const handlePdfClick = () => {
    soundFx.playChirp();
    if (project.reportUrl) {
      openPdfModal(project.reportUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none font-mono animate-fadeIn">
      {/* Modal Container */}
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-[#070b14]/95 border border-[#00f2fe]/40 rounded-2xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,242,254,0.25)] flex flex-col overflow-hidden text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#00f2fe] tracking-widest font-bold">
              <span>⬡ DEEP DIVE INVESTIGATION</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">{project.category}</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-wide mt-1">
              {project.title}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:border-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs tracking-wider font-bold"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">CLOSE [ESC]</span>
          </button>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center gap-2 mb-5 flex-shrink-0">
          <button
            onClick={() => handleTabSwitch('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider transition-all font-bold ${
              activeTab === 'visual'
                ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                : 'text-zinc-400 hover:text-white bg-white/5 border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>VISUAL DEBRIEF</span>
          </button>

          <button
            onClick={() => handleTabSwitch('blueprint')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider transition-all font-bold ${
              activeTab === 'blueprint'
                ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                : 'text-zinc-400 hover:text-white bg-white/5 border border-transparent'
            }`}
          >
            <Activity className="w-4 h-4 text-[#00f2fe]" />
            <span>CYBER BLUEPRINT (NODE FLOW)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-6 flex-1">
          {/* TAB 1: VISUAL DEBRIEF */}
          {activeTab === 'visual' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Screenshot & Links */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl overflow-hidden border border-[#00f2fe]/30 bg-black/60 shadow-lg group relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Direct Action Links */}
                <div className="flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00f2fe] hover:text-[#00f2fe] text-zinc-300 text-xs font-bold transition-all"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GITHUB REPO ↗</span>
                    </a>
                  )}

                  {project.reportUrl && (
                    <button
                      onClick={handlePdfClick}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] hover:bg-[#00f2fe]/20 text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF REPORT ↗</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: STAR Technical Breakdown */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                {/* Tech Stack Chips */}
                <div>
                  <div className="text-[10px] text-[#00f2fe] font-bold uppercase tracking-wider mb-2">
                    // TECH_STACK_MATRIX
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 text-[10px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* STAR Analysis */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[#00f2fe] text-[10px] font-bold tracking-wider">
                      [SITUATION & CHALLENGE]
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {project.star.situation}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[#00f2fe] text-[10px] font-bold tracking-wider">
                      [ENGINEERING TASK]
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {project.star.task}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[#00f2fe] text-[10px] font-bold tracking-wider">
                      [IMPLEMENTED ACTION]
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {project.star.action}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/30 space-y-1">
                    <div className="text-emerald-400 text-[10px] font-bold tracking-wider">
                      [RESULT & PERFORMANCE METRIC]
                    </div>
                    <p className="text-emerald-300 text-[11px] leading-relaxed">
                      {project.star.result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CYBER BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <CyberBlueprint projectId={project.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
