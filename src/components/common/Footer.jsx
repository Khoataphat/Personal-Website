import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { profileData } from '../../data/profile';

// Inline SVGs for brand social icons to ensure 100% reliability
const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-surface/80 backdrop-blur-lg pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-white/10 flex items-center justify-center">
                <span className="text-primary font-mono text-sm font-bold">DK</span>
              </div>
              <span className="text-lg font-display font-bold text-text-main">
                {profileData.name}
              </span>
            </div>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              {profileData.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Profile"
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter Profile"
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold tracking-wider text-text-main uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a href="#hero" className="hover:text-primary transition-colors">
                  The Prologue (Hero)
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors">
                  The Origin (About)
                </a>
              </li>
              <li>
                <a href="#arsenal" className="hover:text-primary transition-colors">
                  The Arsenal (Tech Stack)
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-primary transition-colors">
                  Key Operations (Projects)
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-primary transition-colors">
                  The Chronicles (Blog)
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold tracking-wider text-text-main uppercase">
              Transmission
            </h4>
            <p className="text-sm text-text-muted">
              {profileData.location}
            </p>
            <p className="text-sm text-primary font-mono">
              {profileData.phone}
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-primary transition-colors group"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-dim">
          <p>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-accent-magenta fill-accent-magenta inline" />
            <span>using React, GSAP & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
