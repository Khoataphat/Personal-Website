import React, { useState } from 'react';
import { skillsData } from '../../../data/skills';
import { Cpu, Terminal, Radio, Database, Sparkles } from 'lucide-react';
import { soundFx } from '../../../services/soundFx';

export function PanelContentSkills() {
  const [activeTab, setActiveTab] = useState(0);

  const categoryIcons = [Terminal, Sparkles, Radio, Database];

  const handleTabChange = (idx) => {
    soundFx.playChirp();
    setActiveTab(idx);
  };

  const currentCategory = skillsData[activeTab] || skillsData[0];

  return (
    <div className="font-mono text-xs text-zinc-300 space-y-2.5 select-none">
      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-black/40 border border-white/10">
        {skillsData.map((cat, idx) => {
          const Icon = categoryIcons[idx] || Cpu;
          const isActive = activeTab === idx;
          return (
            <button
              key={cat.slug}
              onClick={() => handleTabChange(idx)}
              className={`flex flex-col items-center py-1 px-1 rounded transition-all ${
                isActive
                  ? 'bg-[#00f2fe]/20 text-white border border-[#00f2fe]/60 font-bold shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title={cat.category}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5 text-[#00f2fe]" />
              <span className="text-[8px] uppercase tracking-wider truncate max-w-full">
                {cat.category.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Header */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pb-1 border-b border-white/10">
        <span className="text-[#00f2fe] font-bold tracking-wider">// {currentCategory.category.toUpperCase()}</span>
        <span>{currentCategory.skills.length} MODULES</span>
      </div>

      {/* Skills Grid List */}
      <div className="space-y-1.5 max-h-[165px] overflow-y-auto pr-1">
        {currentCategory.skills.map((skill) => (
          <div
            key={skill.name}
            className="p-2 rounded bg-black/30 border border-white/5 hover:border-[#00f2fe]/40 transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]" />
                <span>{skill.name}</span>
              </div>
              <div className="text-[9px] text-zinc-400 mt-0.5">{skill.highlight}</div>
            </div>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#00f2fe] font-bold whitespace-nowrap">
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
