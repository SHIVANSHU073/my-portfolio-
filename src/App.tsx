/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.js';
import Home from './components/Home.js';
import About from './components/About.js';
import Skills from './components/Skills.js';
import Projects from './components/Projects.js';
import Services from './components/Services.js';
import Certificates from './components/Certificates.js';
import Blog from './components/Blog.js';
import Testimonials from './components/Testimonials.js';
import Contact from './components/Contact.js';
import FAQComponent from './components/FAQ.js';
import Footer from './components/Footer.js';
import AdminLogin from './components/AdminLogin.js';
import AdminDashboard from './components/AdminDashboard.js';
import { PortfolioData } from './types.js';
import { LanguageCode } from './data/translations.js';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [darkMode, setDarkMode] = useState(true); // Default to a gorgeous dark mode experience
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  // Gateway Protection State (Code: 123456)
  const [gatewayUnlocked, setGatewayUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('shivanshu-gateway-unlocked') === 'true';
  });
  const [gatewayPassword, setGatewayPassword] = useState('');
  const [gatewayError, setGatewayError] = useState('');

  // Initialize Theme and Admin Session on Mount
  useEffect(() => {
    // Session token
    const token = localStorage.getItem('shivanshu-admin-token');
    if (token) {
      setAdminToken(token);
    }

    // Language setting
    const savedLang = localStorage.getItem('shivanshu-lang') as LanguageCode;
    if (savedLang) {
      setCurrentLang(savedLang);
    }

    // Dark Mode stylesheet injector
    const theme = localStorage.getItem('theme');
    const isDark = theme === null ? true : theme === 'dark'; // default to dark
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Sync Dark Mode state to root HTML element
  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleChangeLang = (lang: LanguageCode) => {
    setCurrentLang(lang);
    localStorage.setItem('shivanshu-lang', lang);
  };

  // Fetch Public Portfolio Data
  const loadPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const payload = await response.json();
        setPortfolioData(payload);
      }
    } catch (err) {
      console.error('Error fetching portfolio database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  // Track Page Views when changing views or scrolling sections
  useEffect(() => {
    const trackPage = async () => {
      try {
        await fetch('/api/portfolio/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pathName: currentView })
        });
      } catch (err) {
        // fail silently for telemetry
      }
    };
    trackPage();
  }, [currentView]);

  // Submit contact message proxy
  const handleSubmitContact = async (form: { name: string; email: string; subject: string; message: string }) => {
    try {
      const response = await fetch('/api/portfolio/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  };

  // Increment view telemetry counter
  const handleIncrementBlogViews = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/blogs/${id}/view`, {
        method: 'POST'
      });
      if (response.ok) {
        // update local client counter immediately
        setPortfolioData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            blogs: prev.blogs.map((b) => (b.id === id ? { ...b, views: (b.views || 0) + 1 } : b))
          };
        });
      }
    } catch (err) {
      // silently skip view failures
    }
  };

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('shivanshu-admin-token', token);
    setCurrentView('admin');
  };

  const handleLogOut = () => {
    setAdminToken(null);
    localStorage.removeItem('shivanshu-admin-token');
    setCurrentView('portfolio');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <div className="relative h-12 w-12 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600" />
        </div>
        <p className="mt-4 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Synthesizing Creative Portfolio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 selection:bg-indigo-600 selection:text-[#E6E2DA]">
      {/* Background visual light leak meshes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20 z-0">
        <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#B4AC92]/25 dark:bg-[#5A5A40]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#5A5A40]/15 dark:bg-[#B4AC92]/10 blur-3xl" />
      </div>

      {/* Global Glassmorphic Nav Header */}
      <Navbar
        currentLang={currentLang}
        onChangeLang={handleChangeLang}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isAdmin={!!adminToken}
        onLogOut={handleLogOut}
        setView={setCurrentView}
        currentView={currentView}
      />

      <div className="relative z-10">
        {currentView === 'admin' ? (
          /* ADMIN WORKSPACE VIEW WITH GATEWAY PROTECTION */
          !gatewayUnlocked ? (
            <div className="min-h-[calc(100vh-80px)] pt-28 pb-16 px-4 flex flex-col items-center justify-center animate-fade-in">
              <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-xl space-y-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-rose-500" />
                
                <div className="inline-flex p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 ring-4 ring-amber-500/10 mx-auto">
                  <Lock size={32} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Admin Gateway Protection
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    This workspace area is restricted. Please enter the security gateway access key to continue.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (gatewayPassword === '123456') {
                      setGatewayUnlocked(true);
                      sessionStorage.setItem('shivanshu-gateway-unlocked', 'true');
                      setGatewayError('');
                    } else {
                      setGatewayError('Incorrect gateway access key. Please try again.');
                    }
                  }}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Gateway Access Key</label>
                    <input
                      type="password"
                      required
                      value={gatewayPassword}
                      onChange={(e) => setGatewayPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-center font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {gatewayError && (
                    <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs">
                      <ShieldAlert size={16} className="shrink-0" />
                      <span>{gatewayError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Unlock Gateway
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-150 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentView('portfolio')}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Portfolio</span>
                  </button>
                </div>
              </div>
            </div>
          ) : adminToken ? (
            <AdminDashboard
              token={adminToken}
              onBackToPortfolio={() => setCurrentView('portfolio')}
              onRefreshData={loadPortfolio}
            />
          ) : (
            <AdminLogin
              currentLang={currentLang}
              onLoginSuccess={handleLoginSuccess}
              onBackToPortfolio={() => setCurrentView('portfolio')}
            />
          )
        ) : (
          /* PUBLIC PORTFOLIO CONTAINER (SINGLE-VIEW MODULAR ANCHORS) */
          portfolioData && (
            <main className="animate-fade-in">
              <Home profile={portfolioData.profile} currentLang={currentLang} />
              <About
                profile={portfolioData.profile}
                timeline={portfolioData.timeline}
                stats={portfolioData.stats}
                currentLang={currentLang}
              />
              <Skills skills={portfolioData.skills} currentLang={currentLang} />
              <Projects projects={portfolioData.projects} currentLang={currentLang} />
              <Services services={portfolioData.services} currentLang={currentLang} />
              <Certificates certificates={portfolioData.certificates} currentLang={currentLang} />
              <Blog
                blogs={portfolioData.blogs}
                currentLang={currentLang}
                onIncrementViews={handleIncrementBlogViews}
              />
              <Testimonials testimonials={portfolioData.testimonials} currentLang={currentLang} />
              <Contact
                profile={portfolioData.profile}
                currentLang={currentLang}
                onSubmitContact={handleSubmitContact}
              />
              <FAQComponent faqs={portfolioData.faqs} currentLang={currentLang} />
              <Footer profile={portfolioData.profile} currentLang={currentLang} />
            </main>
          )
        )}
      </div>
    </div>
  );
}
