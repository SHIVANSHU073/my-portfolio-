/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Github } from 'lucide-react';
import { Project } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';

interface ProjectsProps {
  projects: Project[];
  currentLang: LanguageCode;
}

export default function Projects({ projects, currentLang }: ProjectsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const t = translations[currentLang];

  // Derive unique categories from projects list
  const categories = useMemo(() => {
    const list = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(list)];
  }, [projects]);

  // Filters logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, selectedCategory]);

  return (
    <section
      id="projects"
      className="py-20 bg-white dark:bg-slate-900 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.projectsTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.projectsSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Search and Category Filters controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          {/* Search box */}
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.projectsSearch}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {category === 'All' ? t.projectsAll : category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 shadow-sm hover:shadow-xl hover:border-indigo-150 dark:hover:border-indigo-900/60 transition-all duration-300 flex flex-col"
              >
                {/* Image Wrap */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Category Pill Overlaid */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-white px-3 py-1.5 rounded-full shadow-sm">
                      {project.category}
                    </span>
                  </div>
                  {/* Featured Pill if active */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-sm">
                        ★ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
                      {project.description}
                    </p>
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono font-medium bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Call-to-actions */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-6 mt-6">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      <Github size={16} />
                      <span>{t.projectsCode}</span>
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity"
                    >
                      <span>{t.projectsLive}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t.projectsNoFound}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
