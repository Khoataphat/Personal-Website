import React, { useState } from 'react';
import { sendEmailMessage, validateContactForm } from '../../../services/emailService';
import { soundFx } from '../../../services/soundFx';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Mail, User, MessageSquare } from 'lucide-react';

export function PanelContentContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Cybernetic Transmission',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFx.playChirp();

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setStatus('sending');
    setFeedback('');

    try {
      const res = await sendEmailMessage(formData);
      setStatus('success');
      setFeedback(res.message || 'Signal transmission successfully dispatched!');
      soundFx.playToggle();
      setFormData({ name: '', email: '', subject: 'Cybernetic Transmission', message: '' });
      setErrors({});
    } catch (err) {
      setStatus('error');
      setFeedback(err.message || 'Transmission failed. Direct email: khoataphat@gmail.com');
    }
  };

  return (
    <div className="font-mono text-xs text-zinc-300 space-y-2 select-none">
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pb-1 border-b border-white/10">
        <span className="text-[#00f2fe] font-bold tracking-wider">// COMM_TRANSMISSION_UPLINK</span>
        <span className="text-emerald-400 font-bold">● ONLINE</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 text-left">
        {/* Name & Email */}
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="OPERATOR NAME"
              className={`w-full px-2 py-1 rounded bg-black/50 border ${
                errors.name ? 'border-rose-500' : 'border-white/10 focus:border-[#00f2fe]'
              } text-[10px] text-white placeholder:text-zinc-500 outline-none transition-colors`}
            />
            {errors.name && <p className="text-[8px] text-rose-400 mt-0.5">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="EMAIL UPLINK"
              className={`w-full px-2 py-1 rounded bg-black/50 border ${
                errors.email ? 'border-rose-500' : 'border-white/10 focus:border-[#00f2fe]'
              } text-[10px] text-white placeholder:text-zinc-500 outline-none transition-colors`}
            />
            {errors.email && <p className="text-[8px] text-rose-400 mt-0.5">{errors.email}</p>}
          </div>
        </div>

        {/* Message Payload */}
        <div>
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="ENTER PAYLOAD / TRANSMISSION MESSAGE..."
            className={`w-full px-2 py-1.5 rounded bg-black/50 border ${
              errors.message ? 'border-rose-500' : 'border-white/10 focus:border-[#00f2fe]'
            } text-[10px] text-white placeholder:text-zinc-500 outline-none transition-colors resize-none`}
          />
          {errors.message && <p className="text-[8px] text-rose-400 mt-0.5">{errors.message}</p>}
        </div>

        {/* Feedback Alert */}
        {status === 'success' && (
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 border border-[#00f2fe] text-white text-[10px] font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(0,242,254,0.2)] disabled:opacity-50"
        >
          {status === 'sending' ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin text-[#00f2fe]" />
              <span>TRANSMITTING SIGNAL...</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3 text-[#00f2fe]" />
              <span>► DISPATCH TRANSMISSION</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
