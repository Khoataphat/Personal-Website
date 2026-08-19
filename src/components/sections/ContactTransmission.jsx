import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profileData } from '../../data/profile';
import { sendEmailMessage, validateContactForm } from '../../services/emailService';
import { getAssetUrl } from '../../utils/urlHelper';
import {
  Send,
  Mail,
  User,
  MessageSquare,
  FileText,
  FileDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Radio,
  MapPin,
  Phone,
  ArrowUpRight,
  RefreshCw,
  Eye
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

// Magnetic Social Link Component
function MagneticSocialLink({ href, icon: Icon, label, username }) {
  const linkRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * 0.25, y: y * 0.25 });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: pos.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out'
      }}
      className="flex items-center justify-between p-3.5 rounded-2xl glass-card border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-mono font-bold text-text-main group-hover:text-primary transition-colors">
            {label}
          </p>
          <p className="text-[11px] font-mono text-text-dim">{username}</p>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-text-dim group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </a>
  );
}

export default function ContactTransmission() {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | sending | success | error
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Fire celebratory multi-burst confetti
  const triggerConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#00f2fe', '#4facfe'] });
    fire(0.2, { spread: 60, colors: ['#7928ca', '#ff0080'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#10b981', '#00f2fe'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setSubmitStatus('sending');
    setFeedbackMessage('');

    try {
      const res = await sendEmailMessage(formData);
      setSubmitStatus('success');
      setFeedbackMessage(res.message || 'Transmission dispatched successfully!');
      triggerConfetti();
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormErrors({});
    } catch (err) {
      setSubmitStatus('error');
      setFeedbackMessage(err.message || 'Failed to dispatch transmission. Please contact me directly via email.');
    }
  };

  // GSAP ScrollTrigger Entrance Animation
  useGSAP(
    () => {
      gsap.from('.contact-anim-item', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    },
    { scope: sectionRef }
  );

  const cvDownloadUrl = getAssetUrl(profileData.cvPath);
  const cvWebUrl = getAssetUrl('./cv/index.html');

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none"
    >
      {/* Ambient Grid Pattern */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-mono text-primary shadow-glow-cyan">
          <Radio className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
          <span>SCENE 06 : TRANSMISSION TERMINAL</span>
          <span className="text-white/20">•</span>
          <span className="text-text-muted">OPEN COMM CHANNELS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-text-main">
          Initialize <span className="gradient-text-cinema">Transmission</span>
        </h2>

        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
          Ready to engineer high-throughput systems, collaborate on innovative projects, or discuss software opportunities. Send a message directly to my station.
        </p>
      </div>

      {/* Main Grid: Contact Form (Left) & Station Intel / CV Hub (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cyber Terminal Contact Form */}
        <div className="contact-anim-item lg:col-span-7 glass-panel p-6 sm:p-9 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-text-dim ml-2">secure_uplink_terminal.sh</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>CHANNEL READY</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Your Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-3 rounded-xl bg-surface-subtle border ${
                    formErrors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-primary/60'
                  } text-sm text-text-main placeholder:text-text-dim font-mono focus:outline-none transition-colors`}
                />
                {formErrors.name && (
                  <p className="text-[11px] font-mono text-rose-400 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  className={`w-full px-4 py-3 rounded-xl bg-surface-subtle border ${
                    formErrors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-primary/60'
                  } text-sm text-text-main placeholder:text-text-dim font-mono focus:outline-none transition-colors`}
                />
                {formErrors.email && (
                  <p className="text-[11px] font-mono text-rose-400 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>Subject / Project Purpose *</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Collaboration on Distributed Systems / Job Opportunity"
                className={`w-full px-4 py-3 rounded-xl bg-surface-subtle border ${
                  formErrors.subject ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-primary/60'
                } text-sm text-text-main placeholder:text-text-dim font-mono focus:outline-none transition-colors`}
              />
              {formErrors.subject && (
                <p className="text-[11px] font-mono text-rose-400 mt-1">{formErrors.subject}</p>
              )}
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span>Transmission Payload (Message) *</span>
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your transmission parameters, project scope, or inquiry..."
                className={`w-full px-4 py-3 rounded-xl bg-surface-subtle border ${
                  formErrors.message ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-primary/60'
                } text-sm text-text-main placeholder:text-text-dim font-mono focus:outline-none transition-colors resize-none`}
              />
              {formErrors.message && (
                <p className="text-[11px] font-mono text-rose-400 mt-1">{formErrors.message}</p>
              )}
            </div>

            {/* Feedback Notifications */}
            {submitStatus === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">TRANSMISSION CONFIRMED</p>
                  <p className="mt-0.5 text-emerald-300/90">{feedbackMessage}</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">UPLINK INTERRUPTED</p>
                  <p className="mt-0.5 text-rose-300/90">{feedbackMessage}</p>
                  <p className="mt-1 text-[10px] text-text-muted">
                    Fallback: Send directly to <a href={`mailto:${profileData.email}`} className="text-primary underline">{profileData.email}</a>
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitStatus === 'sending'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs font-bold text-background bg-primary hover:bg-primary-glow shadow-glow-cyan transition-all duration-300 disabled:opacity-50 active:scale-[0.99]"
            >
              {submitStatus === 'sending' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-background" />
                  <span>TRANSMITTING SIGNAL...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-background" />
                  <span>DISPATCH TRANSMISSION</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Résumé / CV Station & Direct Social Channels */}
        <div className="space-y-6 lg:col-span-5">
          {/* CV & Résumé Download Box */}
          <div className="contact-anim-item glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-display font-bold text-text-main">
                  Curriculum Vitae
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                UPDATED 2026
              </span>
            </div>

            <p className="text-xs text-text-muted font-light leading-relaxed">
              Full overview of engineering track record, technical coursework, university projects, and technical skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={cvDownloadUrl}
                download="CV-DangKhoa.pdf"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-semibold text-background bg-primary hover:bg-primary-glow shadow-glow-cyan transition-all active:scale-95"
              >
                <FileDown className="w-4 h-4 text-background" />
                <span>Download PDF</span>
              </a>

              <a
                href={cvWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-medium text-text-main glass-card border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all"
                title="View Interactive HTML CV in new tab"
              >
                <Eye className="w-4 h-4 text-primary" />
                <span>Web CV</span>
                <ExternalLink className="w-3 h-3 text-text-dim" />
              </a>
            </div>
          </div>

          {/* Quick Direct Info */}
          <div className="contact-anim-item glass-panel p-6 rounded-3xl border border-white/10 space-y-3 font-mono text-xs text-text-muted">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-accent-cyan shrink-0" />
              <span>{profileData.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent-violet shrink-0" />
              <a href={`mailto:${profileData.email}`} className="hover:text-primary transition-colors">
                {profileData.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{profileData.phone}</span>
            </div>
          </div>

          {/* Magnetic Social Grid */}
          <div className="contact-anim-item space-y-2.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-text-dim px-1">
              Direct Uplink Channels
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              <MagneticSocialLink
                href={profileData.socials.github}
                icon={GithubIcon}
                label="GitHub Repository"
                username="@Khoataphat"
              />
              <MagneticSocialLink
                href={profileData.socials.linkedin}
                icon={LinkedinIcon}
                label="LinkedIn Profile"
                username="khoataphat"
              />
              <MagneticSocialLink
                href={profileData.socials.facebook}
                icon={FacebookIcon}
                label="Facebook Network"
                username="Dang Khoa"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
