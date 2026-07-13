/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check } from 'lucide-react';
import { Service } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';
import LucideIcon from './LucideIcon.js';

interface ServicesProps {
  services: Service[];
  currentLang: LanguageCode;
}

export default function Services({ services, currentLang }: ServicesProps) {
  const t = translations[currentLang];

  const handleInquire = (serviceTitle: string) => {
    // Scroll to contact form and fill details if possible, or just scroll to focus
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // pre-fill subject line
      const subjectInput = document.getElementById('contact-subject') as HTMLInputElement;
      if (subjectInput) {
        subjectInput.value = `Inquiry regarding: ${serviceTitle}`;
      }
    }
  };

  return (
    <section
      id="services"
      className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.servicesTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.servicesSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Services pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative rounded-3xl p-8 bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                service.popular
                  ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/10 scale-100 lg:scale-[1.03]'
                  : 'border-slate-200/60 dark:border-slate-800'
              }`}
            >
              {/* Popular Tag Badge */}
              {service.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                  <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-1.5 rounded-full shadow-md">
                    {t.servicesPopular}
                  </span>
                </div>
              )}

              {/* Service header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${
                    service.popular
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}>
                    <LucideIcon name={service.iconName} size={22} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price */}
                <div className="border-t border-b border-slate-100 dark:border-slate-800 py-5">
                  <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                    {service.price}
                  </p>
                </div>

                {/* Features checklist */}
                <ul className="space-y-3 pt-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <span className="p-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                        <Check size={14} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => handleInquire(service.title)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${
                    service.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.servicesOrder}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
