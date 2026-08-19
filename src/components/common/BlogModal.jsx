import React, { useEffect, useRef, useState } from 'react';
import { X, Calendar, Clock, BookOpen, Tag, Share2, Check } from 'lucide-react';

export default function BlogModal({ isOpen, onClose, blog }) {
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScrollProgress(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.round((scrollTop / maxScroll) * 100)));
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !blog) return null;

  // Simple Markdown Parser for technical notes
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.trim().split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-lg sm:text-xl font-display font-bold text-text-main mt-6 mb-3 flex items-center gap-2"
          >
            <span className="w-1.5 h-4 rounded-full bg-primary" />
            <span>{trimmed.replace('### ', '')}</span>
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-xl sm:text-2xl font-display font-extrabold text-primary mt-7 mb-3"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Unordered list item
      if (trimmed.startsWith('- ')) {
        const itemText = trimmed.replace('- ', '');
        return (
          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-muted mb-2 leading-relaxed pl-2">
            <span className="text-primary mt-1">&bull;</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemText) }} />
          </li>
        );
      }

      // Numbered list item
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-muted mb-2 leading-relaxed pl-2">
            <span className="font-mono text-primary font-bold text-xs">{trimmed.match(/^\d+\./)[0]}</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed.replace(/^\d+\.\s*/, '')) }} />
          </li>
        );
      }

      // Empty line / paragraph spacing
      if (trimmed === '') {
        return <div key={idx} className="h-3" />;
      }

      // Regular paragraph
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm text-text-muted leading-relaxed font-light mb-3"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
        />
      );
    });
  };

  // Helper for bold and inline code
  const formatInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-main font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-subtle border border-white/10 font-mono text-cyan-300 text-xs">$1</code>');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl glass-panel border border-primary/30 shadow-[0_0_50px_rgba(0,242,254,0.18)] overflow-hidden bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Reading Progress Bar */}
        <div className="h-1 w-full bg-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent-violet to-primary shadow-[0_0_10px_#00f2fe] transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-surface-subtle/70 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/25 font-semibold">
              {blog.category}
            </span>
            <div className="flex items-center gap-3 text-xs font-mono text-text-dim">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{blog.date}</span>
              </span>
              <span className="hidden sm:inline text-white/20">&bull;</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{blog.readTime}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card border border-white/10 text-xs font-mono text-text-muted hover:text-primary transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 sm:py-8 space-y-6"
        >
          {/* Main Title & Excerpt */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-text-main leading-tight">
              {blog.title}
            </h1>
            <p className="text-sm sm:text-base font-mono text-text-muted leading-relaxed font-light">
              {blog.excerpt}
            </p>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {blog.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/5 text-text-dim"
                >
                  <Tag className="w-3 h-3 text-primary" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none text-text-main">
            {renderFormattedContent(blog.content)}
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-dim bg-surface-subtle/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Authored by Pham Tuan Dang Khoa</span>
            </div>
            <span>Published on Personal Engineering Chronicles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
