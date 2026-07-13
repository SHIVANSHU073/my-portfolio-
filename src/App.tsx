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

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [darkMode, setDarkMode] = useState(true); // Default to a gorgeous dark mode experience
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

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
          /* ADMIN WORKSPACE VIEW */
          adminToken ? (
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
