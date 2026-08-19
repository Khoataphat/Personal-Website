import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Download, FileText, AlertCircle, Maximize2 } from 'lucide-react';
import { getAssetUrl } from '../../utils/urlHelper';

export default function PdfViewerModal({ isOpen, onClose, pdfUrl, projectTitle }) {
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !pdfUrl) return null;

  const resolvedUrl = getAssetUrl(pdfUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl glass-panel border border-primary/30 shadow-[0_0_50px_rgba(0,242,254,0.2)] overflow-hidden bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-surface-subtle/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
                  Engineering Report
                </span>
                <span className="text-xs font-mono text-text-dim hidden sm:inline">PDF Document</span>
              </div>
              <h3 className="text-sm sm:text-base font-display font-bold text-text-main truncate mt-0.5">
                {projectTitle || 'Technical Project Report'}
              </h3>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-text-muted hover:text-primary hover:bg-white/5 border border-white/10 transition-colors"
              title="Open in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Tab</span>
            </a>

            <a
              href={resolvedUrl}
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-background bg-primary hover:bg-primary-glow font-medium shadow-glow-cyan transition-colors"
              title="Download PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-white/10 transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / PDF Frame */}
        <div className="relative flex-1 w-full bg-[#0a0a0f] overflow-hidden flex flex-col justify-center items-center">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/90 z-10">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-text-muted">Loading Technical Documentation...</p>
            </div>
          )}

          <iframe
            src={resolvedUrl}
            title={projectTitle || 'Project Report'}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
          />

          {/* Fallback Notice in case PDF cannot be embedded */}
          <noscript>
            <div className="p-6 text-center space-y-3">
              <p className="text-sm text-text-muted">Your browser does not support inline PDF viewing.</p>
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background text-xs font-mono font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                View Report Directly
              </a>
            </div>
          </noscript>
        </div>

        {/* Modal Footer / Hint */}
        <div className="px-4 sm:px-6 py-2.5 bg-surface-subtle/60 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-text-dim">
          <div className="flex items-center gap-1.5 truncate">
            <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Viewing compiled technical report. Press ESC to exit.</span>
          </div>
          <span className="hidden sm:inline text-text-dim/60">Source: /public/report/</span>
        </div>
      </div>
    </div>
  );
}
