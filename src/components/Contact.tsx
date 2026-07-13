/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Profile } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';

interface ContactProps {
  profile: Profile;
  currentLang: LanguageCode;
  onSubmitContact: (data: { name: string; email: string; subject: string; message: string }) => Promise<boolean>;
}

export default function Contact({ profile, currentLang, onSubmitContact }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const t = translations[currentLang];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Styled Vector Radar Canvas effect representing location tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = 300;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(cx, cy) - 20;

      // Dark background grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      
      // Circles
      for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Sweeper arm line
      angle += 0.015;
      const sx = cx + Math.cos(angle) * maxRadius;
      const sy = cy + Math.sin(angle) * maxRadius;
      
      // Draw fade trail gradient
      const gradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, maxRadius);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.25)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, angle - 0.4, angle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      // Pulsing Pin Target representing owner location
      const pinX = cx + 25;
      const pinY = cy - 40;
      const pulseSize = 8 + Math.abs(Math.sin(Date.now() / 200)) * 6;

      ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.beginPath();
      ctx.arc(pinX, pinY, pulseSize, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.beginPath();
      ctx.arc(pinX, pinY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Text label over waypoint
      ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(profile.location.toUpperCase(), pinX + 10, pinY + 3);

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [profile.location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please provide all requested form fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await onSubmitContact(form);
      if (res) {
        setSuccess(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Submission failed. Please check network and retry.');
      }
    } catch (err) {
      setError('An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(
    `Hi ${profile.name}, I'm interested in working with you on a software project!`
  )}`;

  return (
    <section
      id="contact"
      className="py-20 bg-white dark:bg-slate-900 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.contactSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Info + Radar canvas */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                Contact Coordinates
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-sans">
                Have an enterprise product concept or require a performance-focused senior creative architect? Reach out directly via the transmission portal, whatsapp secure chat line, or direct coordinates.
              </p>
            </div>

            {/* Coordinates boxes */}
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors shadow-sm cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {t.contactInfoEmail}
                  </p>
                  <p className="text-sm font-sans font-bold text-slate-900 dark:text-white">
                    {profile.email}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors shadow-sm cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {t.contactInfoPhone}
                  </p>
                  <p className="text-sm font-sans font-bold text-slate-900 dark:text-white">
                    {profile.phone}
                  </p>
                </div>
              </a>

              <div
                className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 shadow-sm"
              >
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {t.contactInfoLocation}
                  </p>
                  <p className="text-sm font-sans font-bold text-slate-900 dark:text-white">
                    {profile.location}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp direct messaging block */}
            <div>
              <a
                href={whatsappLink}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors active:scale-95 cursor-pointer"
              >
                <MessageSquare size={18} />
                <span>{t.contactWhatsapp}</span>
              </a>
            </div>

            {/* Dynamic radar canvas block */}
            <div className="rounded-3xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shadow-sm overflow-hidden flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3 self-start">
                🛰️ {t.contactInteractiveMap}
              </span>
              <canvas ref={canvasRef} className="w-full bg-slate-950 rounded-2xl" />
            </div>

          </div>

          {/* Right panel: Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-6">
              
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                Transmission Portal
              </h3>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm font-sans font-semibold text-center animate-fade-in">
                  <p>{t.contactFormSuccess}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs underline font-semibold cursor-pointer text-indigo-600 dark:text-indigo-400 block mx-auto"
                  >
                    Send another transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-150 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  {/* Name field */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {t.contactFormName}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {t.contactFormEmail}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Subject field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {t.contactFormSubject}
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {t.contactFormMessage}
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                      <span>{loading ? t.contactFormSending : t.contactFormSubmit}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
