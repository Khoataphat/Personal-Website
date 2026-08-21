import React from 'react';
import { projectsData } from '../../../data/projects';
import { useCockpitStore } from '../../../store/cockpitStore';
import { soundFx } from '../../../services/soundFx';
import { ExternalLink, Layers, ArrowUpRight } from 'lucide-react';

export function PanelContentProjects() {
  const openProjectModal = useCockpitStore((s) => s.openProjectModal);

  const handleCardClick = (id) => {
    soundFx.playChirp();
    openProjectModal(id);
  };

  return (
    <div className="font-mono text-xs text-zinc-300 space-y-2 select-none">
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pb-1 border-b border-white/10">
        <span className="text-[#00f2fe] font-bold tracking-wider">// MAJOR_SYSTEMS_CATALOG</span>
        <span className="text-zinc-500">4 DEPLOYED</span>
      </div>

      {/* Projects List */}
      <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
        {projectsData.map((project, idx) => (
          <button
            key={project.id}
            onClick={() => handleCardClick(project.id)}
            className="w-full text-left p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#00f2fe] hover:bg-[#00f2fe]/5 transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-[11px] font-bold text-white group-hover:text-[#00f2fe] transition-colors flex items-center gap-1.5 truncate">
                <span className="text-[9px] text-[#00f2fe]/70 font-mono">0{idx + 1}.</span>
                <span className="truncate">{project.title}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#00f2fe] transition-colors flex-shrink-0" />
            </div>

            <div className="text-[9px] text-zinc-400 truncate mb-1.5">{project.subtitle}</div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[8px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-zinc-300"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="text-[8px] text-zinc-500 font-bold">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-[9px] text-center text-[#00f2fe]/80 pt-1 tracking-wider">
        [CLICK CARD FOR DEEP DIVE & BLUEPRINT]
      </div>
    </div>
  );
}
