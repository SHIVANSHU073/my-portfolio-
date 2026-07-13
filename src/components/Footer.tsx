/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Instagram, Mail, CheckCircle2 } from 'lucide-react';
import { Profile } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';
import { animateScrollTo, animateScrollToElement } from '../utils/scroll.js';

interface FooterProps {
  profile: Profile;
  currentLang: LanguageCode;
}

export default function Footer({ profile, currentLang }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[currentLang];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  const handleScrollToTop = () => {
    animateScrollTo(0, 800);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 items-start">
          
          {/* Logo Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={handleScrollToTop}
              className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white block hover:opacity-80"
            >
              <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">SHIVANSHU</span>.
            </button>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm font-sans leading-relaxed">
              Designing premium interfaces and coding robust software systems at the highest technical grade. Feel free to connect for full-product commissions.
            </p>
            {/* Social icons */}
            <div className="flex items-center space-x-4 pt-2">
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                  title="GitHub"
                >
                  <Github size={16} />
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {profile.socials.twitter && (
                <a
                  href={profile.socials.twitter}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                  title="Twitter / X"
                >
                  <Twitter size={16} />
                </a>
              )}
              {profile.socials.instagram && (
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                  title="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick links list */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'home', label: t.navHome },
                { id: 'about', label: t.navAbout },
                { id: 'skills', label: t.navSkills },
                { id: 'projects', label: t.navProjects },
                { id: 'services', label: t.navServices },
                { id: 'certificates', label: t.navCertificates },
                { id: 'blog', label: t.navBlog },
                { id: 'contact', label: t.navContact }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    animateScrollToElement(link.id, 800);
                  }}
                  className="text-left text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors py-1 uppercase font-medium cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              {t.footerNewsletter}
            </h4>
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              {t.footerNewsletterDesc}
            </p>

            {subscribed ? (
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in py-2">
                <CheckCircle2 size={16} />
                <span>{t.footerSubscribed}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer shadow active:scale-95 transition-all"
                >
                  {t.footerSubscribe}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-mono">
            © {currentYear} {profile.name}. {t.footerCopyright}
          </p>
          
          {/* Back to top styled widget */}
          <button
            onClick={handleScrollToTop}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:shadow transition-all cursor-pointer flex items-center justify-center group"
            aria-label="Back to top"
          >
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
