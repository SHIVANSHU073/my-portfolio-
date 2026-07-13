/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowDown, Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react';
import { Profile } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';
import { animateScrollToElement } from '../utils/scroll.js';

interface HomeProps {
  profile: Profile;
  currentLang: LanguageCode;
}

export default function Home({ profile, currentLang }: HomeProps) {
  const [titleIdx, setTitleIdx] = useState(0);
  const [subText, setSubText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const t = translations[currentLang];

  const fullWord = profile.titles[titleIdx] || '';

  // Typewriter Effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const speed = isDeleting ? 35 : 75;

    if (!isDeleting && subText === fullWord) {
      // Pause at full word
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && subText === '') {
      setIsDeleting(false);
      setTitleIdx((prev) => (prev + 1) % profile.titles.length);
    } else {
      timer = setTimeout(() => {
        setSubText((prev) =>
          isDeleting ? prev.slice(0, -1) : fullWord.slice(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [subText, isDeleting, titleIdx, fullWord, profile.titles.length]);

  const handleScrollTo = (id: string) => {
    animateScrollToElement(id, 800);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      {/* Dynamic background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-[#B4AC92]/20 dark:bg-[#5A5A40]/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full bg-[#5A5A40]/15 dark:bg-[#B4AC92]/10 blur-3xl animate-pulse delay-75" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Text content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <span>{t.heroGreeting}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
            {profile.name}
          </h1>

          {/* Typewriter target */}
          <div className="min-h-[40px] flex items-center justify-center lg:justify-start">
            <p className="text-lg sm:text-xl font-mono font-medium text-slate-600 dark:text-slate-300">
              I am a{' '}
              <span className="text-indigo-600 dark:text-indigo-400 border-r-2 border-indigo-500 pr-1 animate-pulse">
                {subText}
              </span>
            </p>
          </div>

          <p className="max-w-xl text-base sm:text-lg text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            {profile.bioShort}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => handleScrollTo('projects')}
              className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              {t.heroCtaWork}
            </button>
            <button
              onClick={() => handleScrollTo('contact')}
              className="w-full sm:w-auto text-center px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all duration-200 cursor-pointer active:scale-95"
            >
              {t.heroCtaContact}
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center space-x-5 pt-4">
            {profile.socials.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                title="GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
            {profile.socials.twitter && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                title="Twitter / X"
              >
                <Twitter size={20} />
              </a>
            )}
            {profile.socials.instagram && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Right Graphic/Photo representation with Glassmorphic Frame */}
        <div className="lg:col-span-5 flex justify-center z-10">
          <div className="relative group w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Ambient shadow gradient */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 opacity-30 blur-xl group-hover:opacity-40 transition duration-300" />

            {/* Photo frame */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-2 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow indicator */}
      <button
        onClick={() => handleScrollTo('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer animate-bounce hidden sm:flex items-center justify-center"
        aria-label="Scroll down"
      >
        <ArrowDown size={16} />
      </button>
    </section>
  );
}
