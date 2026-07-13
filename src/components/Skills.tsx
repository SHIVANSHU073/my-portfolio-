/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Skill } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';
import LucideIcon from './LucideIcon.js';

interface SkillsProps {
  skills: Skill[];
  currentLang: LanguageCode;
}

export default function Skills({ skills, currentLang }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<'Technical' | 'Soft'>('Technical');
  const t = translations[currentLang];

  const filteredSkills = skills.filter(s => s.category === activeCategory);

  // Group by subcategory for neat organization
  const groupedSkills = filteredSkills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const sub = skill.subcategory || 'General';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(skill);
    return acc;
  }, {});

  // SVG Circular progress configurations
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;

  return (
    <section
      id="skills"
      className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.skillsTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.skillsSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Skill Category Selector */}
        <div className="flex justify-center space-x-4 mb-16">
          <button
            onClick={() => setActiveCategory('Technical')}
            className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'Technical'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-150 dark:border-slate-800'
            }`}
          >
            {t.skillsTechnical}
          </button>
          <button
            onClick={() => setActiveCategory('Soft')}
            className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'Soft'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-150 dark:border-slate-800'
            }`}
          >
            {t.skillsSoft}
          </button>
        </div>

        {/* Dynamic Skills categories and circular charts */}
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([subcategory, subSkills]) => (
            <div key={subcategory} className="space-y-6">
              {/* Subtitle */}
              <h3 className="text-sm font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-200/50 dark:border-slate-800/60 pb-2">
                // {subcategory}
              </h3>

              {/* Skills grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {subSkills.map((skill) => {
                  const dashOffset = circumference - (skill.level / 100) * circumference;

                  return (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Icon Wrapper */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          <LucideIcon name={skill.iconName} size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">
                            {skill.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-sans font-medium">
                            {skill.subcategory}
                          </p>
                        </div>
                      </div>

                      {/* Circular Progress Bar */}
                      <div className="relative h-16 w-16 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90">
                          {/* Rail circle */}
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className="text-slate-100 dark:text-slate-800"
                          />
                          {/* Tracker fill circle */}
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out"
                          />
                        </svg>
                        {/* Level index */}
                        <span className="absolute text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
