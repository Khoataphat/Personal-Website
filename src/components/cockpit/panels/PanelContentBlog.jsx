import React from 'react';
import { blogsData } from '../../../data/blogs';
import { useCockpitStore } from '../../../store/cockpitStore';
import { soundFx } from '../../../services/soundFx';
import { BookOpen, Calendar, Clock, ArrowUpRight } from 'lucide-react';

export function PanelContentBlog() {
  const openBlogModal = useCockpitStore((s) => s.openBlogModal);

  const handleBlogClick = (blog) => {
    soundFx.playChirp();
    openBlogModal(blog);
  };

  return (
    <div className="font-mono text-xs text-zinc-300 space-y-2 select-none">
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pb-1 border-b border-white/10">
        <span className="text-[#00f2fe] font-bold tracking-wider">// ARCHIVES_KNOWLEDGE_FEED</span>
        <span className="text-zinc-500">{blogsData.length} ARTICLES</span>
      </div>

      {/* Articles List */}
      <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
        {blogsData.map((blog) => (
          <button
            key={blog.id}
            onClick={() => handleBlogClick(blog)}
            className="w-full text-left p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#00f2fe] hover:bg-[#00f2fe]/5 transition-all group"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <div className="text-[11px] font-bold text-white group-hover:text-[#00f2fe] transition-colors leading-snug line-clamp-2">
                {blog.title}
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#00f2fe] transition-colors flex-shrink-0 mt-0.5" />
            </div>

            <div className="flex items-center gap-3 text-[9px] text-zinc-400 mt-1">
              <span className="text-[#00f2fe]/90 font-semibold">{blog.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-zinc-500" />
                <span>{blog.readTime}</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-[9px] text-center text-[#00f2fe]/80 pt-1 tracking-wider">
        [CLICK ARTICLE TO READ FULL LOG]
      </div>
    </div>
  );
}
