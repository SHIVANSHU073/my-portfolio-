/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Globe, Settings, LogOut, ArrowLeft, LogIn } from 'lucide-react';
import { translations, LanguageCode } from '../data/translations.js';
import { animateScrollTo, animateScrollToElement } from '../utils/scroll.js';

interface NavbarProps {
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isAdmin: boolean;
  onLogOut: () => void;
  setView: (view: 'portfolio' | 'admin') => void;
  currentView: 'portfolio' | 'admin';
}

export default function Navbar({
  currentLang,
  onChangeLang,
  darkMode,
  onToggleDarkMode,
  isAdmin,
  onLogOut,
  setView,
  currentView
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.navHome, id: 'home' },
    { label: t.navAbout, id: 'about' },
    { label: t.navSkills, id: 'skills' },
    { label: t.navProjects, id: 'projects' },
    { label: t.navServices, id: 'services' },
    { label: t.navCertificates, id: 'certificates' },
    { label: t.navBlog, id: 'blog' },
    { label: t.navTestimonials, id: 'navTestimonials' },
    { label: t.navContact, id: 'contact' },
    { label: t.navFaq, id: 'faq' }
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView === 'admin') {
      setView('portfolio');
      // Wait for re-render before scrolling
      setTimeout(() => {
        animateScrollToElement(id, 800);
      }, 100);
    } else {
      animateScrollToElement(id, 800);
    }
  };

  return (
    <nav
      id="nav-container"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-slate-200/40 dark:border-slate-800/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setView('portfolio');
            animateScrollTo(0, 800);
          }}
          className="flex items-center space-x-2 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white cursor-pointer"
        >
          <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Shivanshu.</span>
          <span className="hidden sm:inline font-sans text-sm font-medium text-slate-500 dark:text-slate-400">
            {currentView === 'admin' ? '/admin' : '/portfolio'}
          </span>
        </button>

        {/* Desktop Links */}
        {currentView === 'portfolio' ? (
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-xs font-medium tracking-wide text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer uppercase"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setView('portfolio')}
            className="hidden lg:flex items-center space-x-2 text-xs font-medium tracking-wide text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity uppercase cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{t.navAdminBack}</span>
          </button>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Language Selector */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-1 cursor-pointer">
              <Globe size={18} />
              <span className="text-xs uppercase font-semibold">{currentLang}</span>
            </button>
            <div className="absolute right-0 mt-2 w-28 rounded-xl bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 py-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
              {(['en', 'es', 'de'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onChangeLang(lang)}
                  className={`w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex justify-between items-center cursor-pointer ${
                    currentLang === lang ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="uppercase">{lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Deutsch'}</span>
                  {currentLang === lang && <span className="h-1.5 w-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition-transform duration-300 active:scale-90"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Admin Badges / Action */}
          {isAdmin ? (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setView(currentView === 'admin' ? 'portfolio' : 'admin')}
                className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:opacity-85 transition-opacity cursor-pointer flex items-center justify-center"
                title="Admin Dashboard"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={onLogOut}
                className="p-2 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:opacity-85 transition-opacity cursor-pointer flex items-center justify-center"
                title="Log Out Admin"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setView('admin')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <LogIn size={13} className="text-indigo-600 dark:text-indigo-400" />
              <span>{t.navAdmin}</span>
            </button>
          )}

          {/* Hamburger Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 lg:hidden cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[56px] left-0 w-full h-[calc(100vh-56px)] bg-white dark:bg-slate-950 border-t border-slate-150 dark:border-slate-850 z-40 overflow-y-auto px-6 py-8 flex flex-col space-y-5 animate-in fade-in slide-in-from-top-4 duration-200">
          {currentView === 'portfolio' ? (
            <>
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                Navigation
              </p>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left text-lg font-display font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setView('portfolio');
              }}
              className="text-left text-lg font-display font-semibold text-indigo-600 dark:text-indigo-400 py-1 cursor-pointer flex items-center space-x-2"
            >
              <ArrowLeft size={18} />
              <span>{t.navAdminBack}</span>
            </button>
          )}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Shivanshu Portfolio • Admin System
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
