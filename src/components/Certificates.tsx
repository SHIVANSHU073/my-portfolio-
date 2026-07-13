/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { Certificate } from '../types.js';
import { translations, LanguageCode } from '../data/translations.js';

interface CertificatesProps {
  certificates: Certificate[];
  currentLang: LanguageCode;
}

export default function Certificates({ certificates, currentLang }: CertificatesProps) {
  const t = translations[currentLang];

  return (
    <section
      id="certificates"
      className="py-20 bg-white dark:bg-slate-900 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.certificatesTitle}
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-sans">
            {t.certificatesSubtitle}
          </p>
          <div className="h-1 w-12 bg-indigo-600 dark:bg-indigo-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-900">
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="p-2.5 rounded-xl bg-white/95 dark:bg-slate-950/95 backdrop-blur shadow text-slate-900 dark:text-white">
                    <Award size={18} className="animate-spin-slow" />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {cert.issuer}
                  </span>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 dark:text-white">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans font-medium">
                    Awarded: {cert.date}
                  </p>
                </div>

                {/* External link CTA */}
                <div className="border-t border-slate-100 dark:border-slate-900 pt-4">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <span>{t.certificatesView}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
