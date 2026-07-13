/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { LanguageCode, translations } from '../data/translations.js';

interface AdminLoginProps {
  currentLang: LanguageCode;
  onLoginSuccess: (token: string) => void;
  onBackToPortfolio: () => void;
}

export default function AdminLogin({ currentLang, onLoginSuccess, onBackToPortfolio }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = translations[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setError(data.error || t.adminInvalid);
      }
    } catch (err) {
      setError('Connection to backend failed. Please verify that the node process is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors">
      
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 rounded-full bg-indigo-500 blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Back Link */}
        <button
          onClick={onBackToPortfolio}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer uppercase"
        >
          <ArrowLeft size={16} />
          <span>{t.navAdminBack}</span>
        </button>

        {/* Form Container Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-2">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              {t.adminTitle}
            </h2>
            <p className="text-xs text-slate-400 font-sans uppercase tracking-widest font-semibold">
              {t.adminSubtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-150 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-shake">
                {error}
              </div>
            )}

            {/* Username field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {t.adminUsername}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., admin"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {t.adminPassword}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t.adminLogging}</span>
                  </>
                ) : (
                  <span>{t.adminLogin}</span>
                )}
              </button>
            </div>

          </form>

          {/* Prompt info */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-center text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold uppercase tracking-wider text-[9px] text-slate-400">// Credentials Indicator</p>
            <p>Username: <strong className="text-indigo-600 dark:text-indigo-400">admin</strong></p>
            <p>Password: <strong className="text-indigo-600 dark:text-indigo-400">admin123</strong></p>
          </div>

        </div>

      </div>
    </div>
  );
}
