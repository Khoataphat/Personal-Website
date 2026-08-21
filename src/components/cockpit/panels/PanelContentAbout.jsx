import React from 'react';
import { User, Activity, MapPin, Calendar, Award, Terminal } from 'lucide-react';
import { profileData } from '../../../data/profile';

export function PanelContentAbout() {
  return (
    <div className="font-mono text-xs text-zinc-300 space-y-3 select-none">
      {/* Operator Profile Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00f2fe]/20">
        <div>
          <div className="text-[13px] font-bold text-white tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>{profileData.name.toUpperCase()}</span>
          </div>
          <div className="text-[10px] text-[#00f2fe]/90">{profileData.title}</div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ACTIVE</span>
        </div>
      </div>

      {/* Bio Summary */}
      <p className="text-[11px] text-zinc-300 leading-relaxed">
        {profileData.summary || "Full-Stack Software Engineer & IoT developer specializing in distributed systems, real-time telemetry, and high-performance WebGL architectures."}
      </p>

      {/* Core Stats Bar */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="p-2 rounded bg-black/40 border border-white/10 text-center">
          <div className="text-[14px] font-bold text-[#00f2fe]">4+</div>
          <div className="text-[9px] text-zinc-400 uppercase tracking-wider">Major Projects</div>
        </div>
        <div className="p-2 rounded bg-black/40 border border-white/10 text-center">
          <div className="text-[14px] font-bold text-[#7928ca]">100%</div>
          <div className="text-[9px] text-zinc-400 uppercase tracking-wider">Commitment</div>
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="pt-2 border-t border-white/10 space-y-1.5 text-[10px]">
        <div className="text-[10px] text-[#00f2fe] font-bold tracking-wider">// TIMELINE_MILESTONES</div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-[#00f2fe] font-bold">2022</span>
          <span>──●</span>
          <span>Computer Science Journey Begins</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-[#00f2fe] font-bold">2023</span>
          <span>──●</span>
          <span>First IoT Distributed Prototypes</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-[#00f2fe] font-bold">2024</span>
          <span>──●</span>
          <span>Enterprise Java & Systems Architecture</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300 font-bold">
          <span className="text-[#00f2fe]">2026</span>
          <span className="text-[#00f2fe]">──●</span>
          <span className="text-white">Cybernetic 3D Cockpit Portfolio v2</span>
        </div>
      </div>
    </div>
  );
}
