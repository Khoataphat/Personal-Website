import React, { useState, useEffect } from 'react';
import { Menu, X, FileDown, Sparkles, Terminal, Layers, FolderKanban, BookOpen, Send } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { profileData } from '../../data/profile';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { name: 'Prologue', href: '#hero', icon: Sparkles, id: 'hero' },
    { name: 'About', href: '#about', icon: Terminal, id: 'about' },
    { name: 'Arsenal', href: '#arsenal', icon: Layers, id: 'arsenal' },
    { name: 'Operations', href: '#projects', icon: FolderKanban, id: 'projects' },
    { name: 'Chronicles', href: '#blog', icon: BookOpen, id: 'blog' },
    { name: 'Transmission', href: '#contact', icon: Send, id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Detect current section
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'py-3 glass-nav shadow-glow-box'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="group flex items-center gap-2.5 text-xl font-display font-black tracking-tight"
        >
          <div className="w-9 h-9 rounded-xl bg-surface-subtle border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-glow-cyan transition-all duration-300">
            <span className="text-primary font-mono text-sm font-bold">DK</span>
          </div>
          <span className="text-text-main group-hover:text-primary transition-colors">
            Dang Khoa<span className="text-primary">.</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full glass-panel border border-white/10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                    : 'text-text-muted hover:text-text-main hover:bg-white/5'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Sound */}
        <div className="hidden lg:flex items-center gap-3">
          <AudioPlayer />
          <a
            href={profileData.cvPath}
            download
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium font-mono text-background bg-primary hover:bg-primary-glow shadow-glow-cyan transition-all duration-300 active:scale-95"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>GET CV</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <AudioPlayer />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl bg-surface-subtle border border-white/10 text-text-main hover:border-primary/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-text-muted hover:text-text-main hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{item.name}</span>
                </a>
              );
            })}
            <a
              href={profileData.cvPath}
              download
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-mono font-medium text-background bg-primary shadow-glow-cyan"
            >
              <FileDown className="w-4 h-4" />
              <span>DOWNLOAD CV (PDF)</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
