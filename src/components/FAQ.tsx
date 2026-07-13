/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';

interface FAQProps {
  faqs: FAQ[];
  currentLang: LanguageCode;
}

export default function FAQComponent({ faqs, currentLang }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const t = translations[currentLang];

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.faqTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.faqSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow transition-shadow duration-200"
              >
                {/* Header Toggle */}
                <button
                  onClick={() => handleToggle(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-display font-bold pr-4">
                    {faq.question}
                  </span>
                  <span className={`p-1 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-500 dark:text-indigo-400' : ''
                  }`}>
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Answer body wrapper with max-height animations */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100 border-t border-slate-100 dark:border-slate-850' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
