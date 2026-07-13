/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Calendar, Briefcase, GraduationCap } from 'lucide-react';
import { Profile, TimelineItem, StatItem } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';
import LucideIcon from './LucideIcon.js';

interface AboutProps {
  profile: Profile;
  timeline: TimelineItem[];
  stats: StatItem[];
  currentLang: LanguageCode;
}

export default function About({ profile, timeline, stats, currentLang }: AboutProps) {
  const [timelineType, setTimelineType] = useState<'all' | 'experience' | 'education'>('all');
  const [downloading, setDownloading] = useState(false);
  const t = translations[currentLang];

  const filteredTimeline = timeline.filter((item) => {
    if (timelineType === 'all') return true;
    return item.type === timelineType;
  });

  const handleDownloadCV = (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloading(true);
    // Fake nice download sequence
    setTimeout(() => {
      setDownloading(false);
      alert(`${profile.name} - Curriculum Vitae (PDF) downloaded successfully! (Static Link Prototype)`);
    }, 1200);
  };

  return (
    <section
      id="about"
      className="py-20 bg-white dark:bg-slate-900 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.aboutTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.aboutSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Biography & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 dark:text-white">
              Creative technologist focusing on efficiency and aesthetics.
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
              {profile.bioLong}
            </p>
            <div className="pt-4">
              <a
                href="#download"
                onClick={handleDownloadCV}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Download size={16} className={downloading ? 'animate-bounce' : ''} />
                <span>{downloading ? t.contactFormSending : t.aboutDownloadCV}</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors duration-300 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    <LucideIcon name={stat.iconName} size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Timeline filter pills */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-12">
            {(['all', 'experience', 'education'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTimelineType(type)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  timelineType === type
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {type === 'all'
                  ? 'All History'
                  : type === 'experience'
                  ? t.aboutExperience
                  : t.aboutEducation}
              </button>
            ))}
          </div>

          {/* The Timeline Line list */}
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-12">
            {filteredTimeline.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[39px] sm:-left-[47px] top-1.5 p-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm flex items-center justify-center">
                  {item.type === 'experience' ? (
                    <Briefcase size={14} />
                  ) : (
                    <GraduationCap size={14} />
                  )}
                </div>

                {/* Timeline Card */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/60 transition-colors duration-300 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white">
                        {item.roleOrDegree}
                      </h4>
                      <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 font-sans">
                        {item.organization}
                      </p>
                    </div>
                    <div className="inline-flex items-center space-x-1.5 font-mono text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 h-fit w-fit">
                      <Calendar size={12} />
                      <span>{item.period}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
