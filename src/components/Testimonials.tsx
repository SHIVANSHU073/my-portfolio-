/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';

interface TestimonialsProps {
  testimonials: Testimonial[];
  currentLang: LanguageCode;
}

export default function Testimonials({ testimonials, currentLang }: TestimonialsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const t = translations[currentLang];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Shift every 6 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      id="navTestimonials"
      className="py-20 bg-white dark:bg-slate-900 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.testimonialsTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.testimonialsSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative px-6 md:px-12">
          
          {/* Main Review Card */}
          <div className="relative p-8 md:p-12 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 shadow-md">
            
            {/* Big quote marker */}
            <div className="absolute top-6 right-8 text-slate-200 dark:text-slate-900 pointer-events-none">
              <Quote size={56} className="rotate-180" />
            </div>

            {/* Content Switcher Wrapper with transitions */}
            <div className="space-y-6 animate-fade-in">
              
              {/* Star Rating */}
              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: testimonials[activeIdx]?.rating || 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 font-sans leading-relaxed italic">
                "{testimonials[activeIdx]?.review}"
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center space-x-4 border-t border-slate-100 dark:border-slate-900 pt-6">
                <img
                  src={testimonials[activeIdx]?.imageUrl}
                  alt={testimonials[activeIdx]?.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-indigo-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">
                    {testimonials[activeIdx]?.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans font-medium">
                    {testimonials[activeIdx]?.role} — <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{testimonials[activeIdx]?.company}</span>
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Carousel Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-1 md:-px-4">
            <button
              onClick={handlePrev}
              className="p-2 sm:p-3 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 sm:p-3 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center space-x-2.5 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIdx === idx
                    ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                    : 'w-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-350'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
