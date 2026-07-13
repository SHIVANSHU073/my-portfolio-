/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Clock, Eye, Calendar, ChevronRight } from 'lucide-react';
import { BlogPost } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';

interface BlogProps {
  blogs: BlogPost[];
  currentLang: LanguageCode;
  onIncrementViews: (id: string) => void;
}

export default function Blog({ blogs, currentLang, onIncrementViews }: BlogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);
  const t = translations[currentLang];

  // Derive categories
  const categories = useMemo(() => {
    const list = new Set(blogs.map(b => b.category));
    return ['All', ...Array.from(list)];
  }, [blogs]);

  // Filters
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const handleReadFull = (blog: BlogPost) => {
    setActiveBlogPost(blog);
    onIncrementViews(blog.id);
    window.scrollTo({ top: document.getElementById('blog')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleBackToBlog = () => {
    setActiveBlogPost(null);
    setTimeout(() => {
      document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section
      id="blog"
      className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* IF READ MODE ACTIVE */}
        {activeBlogPost ? (
          <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
            {/* Back action */}
            <button
              onClick={handleBackToBlog}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer uppercase pb-4"
            >
              <ArrowLeft size={16} />
              <span>{t.blogBack}</span>
            </button>

            {/* Hero Cover */}
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
              <img
                src={activeBlogPost.imageUrl}
                alt={activeBlogPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-medium text-slate-400 border-b border-slate-100 dark:border-slate-900 pb-4">
              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px]">
                {activeBlogPost.category}
              </span>
              <span className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{activeBlogPost.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{activeBlogPost.readingTime}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{(activeBlogPost.views || 0) + 1} views</span>
              </span>
            </div>

            {/* Article Heading */}
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
              {activeBlogPost.title}
            </h1>

            {/* Rich Text body rendering */}
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-sans leading-relaxed text-sm sm:text-base space-y-6">
              {/* Very primitive parser for markdown elements like ### or - or list */}
              {activeBlogPost.content.split('\n\n').map((block, idx) => {
                if (block.startsWith('###')) {
                  return (
                    <h3 key={idx} className="text-xl font-display font-bold text-slate-900 dark:text-white pt-4">
                      {block.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (block.startsWith('####')) {
                  return (
                    <h4 key={idx} className="text-lg font-display font-bold text-slate-900 dark:text-white pt-2">
                      {block.replace('####', '').trim()}
                    </h4>
                  );
                }
                if (block.startsWith('-')) {
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-2">
                      {block.split('\n').map((li, liIdx) => (
                        <li key={liIdx}>{li.replace('-', '').trim()}</li>
                      ))}
                    </ul>
                  );
                }
                if (block.startsWith('*') && block.endsWith('*')) {
                  return (
                    <p key={idx} className="italic text-indigo-600 dark:text-indigo-400 font-medium py-2">
                      {block.replace(/\*/g, '').trim()}
                    </p>
                  );
                }
                return <p key={idx}>{block}</p>;
              })}
            </div>

            {/* Tag List */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-900">
              {activeBlogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono font-medium bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* OTHERWISE: GENERAL LISTING VIEW */
          <>
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                {t.blogTitle}
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
                {t.blogSubtitle}
              </p>
              <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
            </div>

            {/* Search and Category Filters controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              {/* Search Box */}
              <div className="relative max-w-md w-full">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.blogSearch}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white"
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

            {/* Blog Posts list mapping */}
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="group rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-950">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {/* Category over overlay */}
                      <span className="absolute top-4 left-4 text-[9px] font-mono font-bold tracking-wider bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-full uppercase shadow">
                        {blog.category}
                      </span>
                    </div>

                    {/* Content wrap */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Meta lines */}
                        <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>{blog.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{blog.readingTime}</span>
                          </span>
                        </div>
                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        {/* Excerpt */}
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Read More trigger */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
                        <button
                          onClick={() => handleReadFull(blog)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity cursor-pointer uppercase"
                        >
                          <span>{t.blogReadMore}</span>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{blog.views || 0}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {t.projectsNoFound}
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
