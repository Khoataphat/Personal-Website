import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blogsData } from '../../data/blogs';
import BlogModal from '../common/BlogModal';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  FileCode2,
  Terminal
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Individual Blog Card with 3D Tilt
function BlogCard({ blog, index, onOpenBlog }) {
  const cardRef = useRef(null);
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenBlog(blog)}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="blog-card-anim group relative rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 hover:border-emerald-400/40 hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(16, 185, 129, 0.12), transparent 70%)`
        }}
      />

      {/* Top Meta Info */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold">
            {blog.category}
          </span>
          <div className="flex items-center gap-2 text-xs font-mono text-text-dim">
            <Calendar className="w-3.5 h-3.5" />
            <span>{blog.date}</span>
          </div>
        </div>

        {/* Title & Excerpt */}
        <div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-text-main group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed font-light line-clamp-3">
            {blog.excerpt}
          </p>
        </div>

        {/* Tag Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {blog.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-subtle border border-white/5 text-text-dim"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Read Action */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-text-dim">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{blog.readTime}</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
          <span>Read Full Note</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export default function BlogSection() {
  const containerRef = useRef(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenBlog = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseBlog = () => {
    setIsModalOpen(false);
  };

  // GSAP ScrollTrigger Entrance Animation
  useGSAP(
    () => {
      const cards = gsap.utils.toArray('.blog-card-anim');
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
    { scope: containerRef }
  );

  return (
    <section
      id="blog"
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-cyber-dots opacity-15 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-xs font-mono text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SCENE 05 : THE CHRONICLES</span>
          <span className="text-white/20">•</span>
          <span className="text-text-muted">ENGINEERING NOTES</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-text-main">
          Technical Insights & <span className="gradient-text-cinema">Chronicles</span>
        </h2>

        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
          Deep-dives into version control strategies, frontend foundations, event-driven loops, and object-oriented clean code architecture.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogsData.map((blog, index) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            index={index}
            onOpenBlog={handleOpenBlog}
          />
        ))}
      </div>

      {/* Blog Reading Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={handleCloseBlog}
        blog={selectedBlog}
      />
    </section>
  );
}
