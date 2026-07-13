/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Code2,
  BookOpen,
  Award,
  Mail,
  Trash2,
  Check,
  Edit2,
  Plus,
  ArrowLeft,
  Settings,
  BarChart3,
  TrendingUp,
  X,
  FileText,
  UserCheck2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { PortfolioData, Profile, Skill, Project, BlogPost, Certificate, ContactMessage, TimelineItem, Service } from '../types.js';

interface AdminDashboardProps {
  token: string;
  onBackToPortfolio: () => void;
  onRefreshData: () => void;
}

export default function AdminDashboard({ token, onBackToPortfolio, onRefreshData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'profile' | 'projects' | 'skills' | 'blogs' | 'certificates' | 'messages'>('analytics');
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [profileForm, setProfileForm] = useState<Profile | null>(null);
  const [editingItem, setEditingItem] = useState<{ type: string; id: string } | null>(null);

  // Modal / Form toggle states
  const [showAddForm, setShowAddForm] = useState<string | null>(null); // 'project', 'skill', 'blog', 'certificate'
  
  // Create / Edit Object models
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ title: '', description: '', category: '', tags: [], imageUrl: '', liveUrl: '', githubUrl: '', featured: false, order: 1 });
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({ name: '', category: 'Technical', subcategory: '', level: 80, iconName: 'Sparkles' });
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({ title: '', excerpt: '', content: '', category: '', tags: [], imageUrl: '', featured: false });
  const [certForm, setCertForm] = useState<Partial<Certificate>>({ title: '', issuer: '', date: '', imageUrl: '', credentialUrl: '' });

  // Fetch full data including admin metrics
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const payload = await response.json();
        setData(payload);
        setProfileForm(payload.profile);
      } else {
        setError('Authentication session expired. Please re-authenticate.');
      }
    } catch (err) {
      setError('Connection to Express database failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm) return;
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        showToast('Profile configuration updated successfully!');
        onRefreshData();
      } else {
        setError('Failed to update profile.');
      }
    } catch (err) {
      setError('Error updating profile.');
    }
  };

  // CRUD handlers
  const handleCreateOrUpdate = async (type: 'projects' | 'skills' | 'blogs' | 'certificates', formObj: any, isEdit = false, id = '') => {
    const url = isEdit ? `/api/admin/${type}/${id}` : `/api/admin/${type}`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formObj)
      });

      if (res.ok) {
        showToast(`${type.toUpperCase()} record updated successfully!`);
        setShowAddForm(null);
        setEditingItem(null);
        fetchAdminData();
        onRefreshData();
      } else {
        setError(`Failed to save ${type}.`);
      }
    } catch (err) {
      setError(`Error saving ${type}.`);
    }
  };

  const handleDelete = async (type: 'projects' | 'skills' | 'blogs' | 'certificates' | 'messages', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type} item?`)) return;
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showToast(`${type.toUpperCase()} record deleted successfully.`);
        fetchAdminData();
        onRefreshData();
      } else {
        setError(`Failed to delete ${type} item.`);
      }
    } catch (err) {
      setError('Error deleting item.');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showToast('Message marked as read.');
        fetchAdminData();
      }
    } catch (err) {
      setError('Error updating message.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center py-20">
        <span className="animate-spin text-indigo-500 mb-4">
          <Settings size={36} />
        </span>
        <p className="text-slate-400 font-mono text-xs">LOADING DATABASE CONSOLE...</p>
      </div>
    );
  }

  const unreadCount = data?.messages?.filter((m) => !m.read)?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-24 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Settings size={18} className="animate-spin-slow" />
              </span>
              <h1 className="text-2xl font-display font-extrabold">Creative Core Console</h1>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Live administrator dashboard for Shivanshu Portfolio Database.
            </p>
          </div>

          <button
            onClick={onBackToPortfolio}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Close Console</span>
          </button>
        </div>

        {/* Global Notifications Panel */}
        {successMsg && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-150 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="p-1 hover:bg-rose-100 rounded">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Console layout Split: Sidebar Navigation + Tab Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
              { id: 'profile', label: 'Edit Profile', icon: User },
              { id: 'projects', label: 'Manage Projects', icon: FolderKanban },
              { id: 'skills', label: 'Manage Skills', icon: Code2 },
              { id: 'blogs', label: 'Manage Blogs', icon: BookOpen },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'messages', label: `Messages (${unreadCount})`, icon: Mail, highlight: unreadCount > 0 }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setShowAddForm(null);
                    setEditingItem(null);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : tab.highlight
                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <TabIcon size={16} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Area */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* ANALYTICS PANEL */}
            {activeTab === 'analytics' && data && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-lg sm:text-xl font-display font-extrabold flex items-center space-x-2">
                  <BarChart3 size={20} className="text-indigo-500" />
                  <span>Real-Time Visitor Analytics</span>
                </h2>

                {/* Scorecards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Total Traffic Sessions</p>
                    <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{data.analytics.totalVisits}</p>
                    <span className="text-[10px] text-indigo-500 font-bold flex items-center space-x-1 mt-2">
                      <TrendingUp size={12} />
                      <span>+12.4% vs last week</span>
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Submitted Messages</p>
                    <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{data.analytics.totalMessages}</p>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center space-x-1 mt-2">
                      <Check size={12} />
                      <span>100% submission rating</span>
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Average Read Time</p>
                    <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-1">4.2 min</p>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1 mt-2">
                      <span>High engagement rank</span>
                    </span>
                  </div>
                </div>

                {/* Grid charts breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Page distribution */}
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Section distribution Views</h3>
                    <div className="space-y-3">
                      {Object.entries(data.analytics.pageViews).map(([page, count]) => {
                        const countNum = Number(count);
                        const percent = Math.min(100, Math.round((countNum / (data.analytics.totalVisits || 1)) * 100));
                        return (
                          <div key={page} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono uppercase">{page}</span>
                              <span className="font-semibold text-slate-500">{countNum} views ({percent}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily Traffic */}
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Visits Timeline History</h3>
                    <div className="space-y-3">
                      {Object.entries(data.analytics.visitsByDate).slice(-6).map(([date, count]) => {
                        const values = Object.values(data.analytics.visitsByDate).map(v => Number(v));
                        const maxCount = Math.max(...values);
                        const countNum = Number(count);
                        const barPercent = Math.round((countNum / (maxCount || 1)) * 100);
                        return (
                          <div key={date} className="flex items-center space-x-3 text-xs">
                            <span className="w-24 font-mono text-slate-400">{date}</span>
                            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden relative">
                              <div className="h-full bg-sky-500 rounded-md" style={{ width: `${barPercent}%` }} />
                            </div>
                            <span className="w-10 text-right font-semibold font-mono">{countNum}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* PROFILE EDIT TAB */}
            {activeTab === 'profile' && profileForm && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in">
                <h2 className="text-lg sm:text-xl font-display font-extrabold flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
                  <User size={20} className="text-indigo-500" />
                  <span>Configure Professional Bio & SEO</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Portfolio Owner Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Primary Contact Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Location Base</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">WhatsApp digits (Int'l)</label>
                    <input
                      type="text"
                      value={profileForm.whatsappNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Short Bio Intro</label>
                  <input
                    type="text"
                    value={profileForm.bioShort}
                    onChange={(e) => setProfileForm({ ...profileForm, bioShort: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Deep Narrative Biography</label>
                  <textarea
                    rows={4}
                    value={profileForm.bioLong}
                    onChange={(e) => setProfileForm({ ...profileForm, bioLong: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-850 pt-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">// SEO & META OPTIONS</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Meta SEO Title</label>
                      <input
                        type="text"
                        value={profileForm.seo.title}
                        onChange={(e) => setProfileForm({ ...profileForm, seo: { ...profileForm.seo, title: e.target.value } })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">SEO Keywords (comma sep)</label>
                      <input
                        type="text"
                        value={profileForm.seo.keywords}
                        onChange={(e) => setProfileForm({ ...profileForm, seo: { ...profileForm.seo, keywords: e.target.value } })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Save Biography Changes
                  </button>
                </div>
              </form>
            )}

            {/* PROJECTS MANAGER TAB */}
            {activeTab === 'projects' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                  <h2 className="text-lg sm:text-xl font-display font-extrabold flex items-center space-x-2">
                    <FolderKanban size={20} className="text-indigo-500" />
                    <span>Manage Case Studies</span>
                  </h2>
                  <button
                    onClick={() => {
                      setProjectForm({ title: '', description: '', category: 'SaaS', tags: [], imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800', liveUrl: '#', githubUrl: 'https://github.com', featured: false, order: 1 });
                      setEditingItem(null);
                      setShowAddForm(showAddForm === 'project' ? null : 'project');
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Project</span>
                  </button>
                </div>

                {/* PROJECT ADD/EDIT FORM MODAL INLINE */}
                {showAddForm === 'project' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateOrUpdate('projects', projectForm, !!editingItem, editingItem?.id);
                    }}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 mb-6"
                  >
                    <h3 className="font-display font-bold text-sm uppercase text-slate-400 mb-2">
                      {editingItem ? 'Edit Project Coordinates' : 'Form: Post New Project'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Category</label>
                        <input
                          type="text"
                          required
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Summary Description</label>
                      <input
                        type="text"
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Image Asset URL</label>
                        <input
                          type="text"
                          required
                          value={projectForm.imageUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Live Client Link</label>
                        <input
                          type="text"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Github Source Link</label>
                        <input
                          type="text"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(projectForm.tags) ? projectForm.tags.join(', ') : projectForm.tags}
                          onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value as any })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Display Order</label>
                        <input
                          type="number"
                          value={projectForm.order}
                          onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="featured-check"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                          className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="featured-check" className="text-xs font-semibold text-slate-500">Feature on top shelf</label>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer">
                        {editingItem ? 'Save Updates' : 'Add New Record'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(null);
                          setEditingItem(null);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* PROJECTS LIST TABLE */}
                <div className="space-y-3">
                  {data.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img src={project.imageUrl} alt={project.title} className="h-12 w-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{project.title}</h4>
                          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-500">
                            {project.category} {project.featured ? '★ FEATURED' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setProjectForm(project);
                            setEditingItem({ type: 'projects', id: project.id });
                            setShowAddForm('project');
                          }}
                          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete('projects', project.id)}
                          className="p-2 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SKILLS MANAGER TAB */}
            {activeTab === 'skills' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                  <h2 className="text-lg sm:text-xl font-display font-extrabold flex items-center space-x-2">
                    <Code2 size={20} className="text-indigo-500" />
                    <span>Manage Professional Skills</span>
                  </h2>
                  <button
                    onClick={() => {
                      setSkillForm({ name: '', category: 'Technical', subcategory: 'Frontend', level: 80, iconName: 'Sparkles' });
                      setEditingItem(null);
                      setShowAddForm(showAddForm === 'skill' ? null : 'skill');
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Skill</span>
                  </button>
                </div>

                {/* SKILL ADD/EDIT FORM */}
                {showAddForm === 'skill' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateOrUpdate('skills', skillForm, !!editingItem, editingItem?.id);
                    }}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 mb-6"
                  >
                    <h3 className="font-display font-bold text-sm uppercase text-slate-400 mb-2">
                      {editingItem ? 'Edit Skill Attributes' : 'Form: Post New Skill'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Skill Name</label>
                        <input
                          type="text"
                          required
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Level (0-100%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          required
                          value={skillForm.level}
                          onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Classification</label>
                        <select
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="Technical">Technical (Development)</option>
                          <option value="Soft">Soft (Interpersonal)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Subcategory</label>
                        <input
                          type="text"
                          required
                          value={skillForm.subcategory}
                          onChange={(e) => setSkillForm({ ...skillForm, subcategory: e.target.value })}
                          placeholder="e.g. Frontend, Creative, Personal"
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Lucide Graphic Icon</label>
                        <input
                          type="text"
                          required
                          value={skillForm.iconName}
                          onChange={(e) => setSkillForm({ ...skillForm, iconName: e.target.value })}
                          placeholder="e.g. Cpu, Atom, Sparkles"
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer">
                        {editingItem ? 'Save Updates' : 'Add New Record'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(null);
                          setEditingItem(null);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* SKILLS LIST ROWS */}
                <div className="space-y-3">
                  {data.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60"
                    >
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{skill.name}</h4>
                        <p className="text-[10px] font-mono text-slate-400">
                          {skill.category} // {skill.subcategory} ({skill.level}%)
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSkillForm(skill);
                            setEditingItem({ type: 'skills', id: skill.id });
                            setShowAddForm('skill');
                          }}
                          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete('skills', skill.id)}
                          className="p-2 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* CERTIFICATES TAB */}
            {activeTab === 'certificates' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                  <h2 className="text-lg sm:text-xl font-display font-extrabold flex items-center space-x-2">
                    <Award size={20} className="text-indigo-500" />
                    <span>Manage Certifications</span>
                  </h2>
                  <button
                    onClick={() => {
                      setCertForm({ title: '', issuer: '', date: '', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600', credentialUrl: '#' });
                      setEditingItem(null);
                      setShowAddForm(showAddForm === 'certificate' ? null : 'certificate');
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Certificate</span>
                  </button>
                </div>

                {/* CERTIFICATE ADD/EDIT FORM */}
                {showAddForm === 'certificate' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateOrUpdate('certificates', certForm, !!editingItem, editingItem?.id);
                    }}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 mb-6"
                  >
                    <h3 className="font-display font-bold text-sm uppercase text-slate-400 mb-2">
                      {editingItem ? 'Edit Certificate Attributes' : 'Form: Post New Certificate'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Certificate Title</label>
                        <input
                          type="text"
                          required
                          value={certForm.title}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Issuer Agency</label>
                        <input
                          type="text"
                          required
                          value={certForm.issuer}
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Award Date</label>
                        <input
                          type="text"
                          required
                          value={certForm.date}
                          onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                          placeholder="e.g. November 2024"
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Cover Image URL</label>
                        <input
                          type="text"
                          required
                          value={certForm.imageUrl}
                          onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Verification URL</label>
                        <input
                          type="text"
                          required
                          value={certForm.credentialUrl}
                          onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer">
                        {editingItem ? 'Save Updates' : 'Add New Record'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(null);
                          setEditingItem(null);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* CERTIFICATES TABLE ROWS */}
                <div className="space-y-3">
                  {data.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60"
                    >
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{cert.title}</h4>
                        <p className="text-[10px] font-mono text-slate-400">
                          {cert.issuer} ({cert.date})
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setCertForm(cert);
                            setEditingItem({ type: 'certificates', id: cert.id });
                            setShowAddForm('certificate');
                          }}
                          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete('certificates', cert.id)}
                          className="p-2 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* MESSAGES INBOX TAB */}
            {activeTab === 'messages' && data && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg sm:text-xl font-display font-extrabold flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                  <Mail size={20} className="text-indigo-500" />
                  <span>Secure Customer Messages Inbox</span>
                </h2>

                <div className="space-y-4">
                  {data.messages && data.messages.length > 0 ? (
                    data.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-6 rounded-2xl border transition-all duration-350 space-y-3 ${
                          msg.read
                            ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-850 text-slate-550 dark:text-slate-450'
                            : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900 text-slate-900 dark:text-white ring-1 ring-indigo-500/5'
                        }`}
                      >
                        {/* Message Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/60 dark:border-slate-900/60 pb-3">
                          <div>
                            <span className="text-[10px] font-mono tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
                              From: {msg.name} ({msg.email})
                            </span>
                            <h4 className="font-display font-bold text-sm sm:text-base mt-1">{msg.subject}</h4>
                          </div>

                          <span className="font-mono text-[10px] text-slate-400">
                            {new Date(msg.date).toLocaleString()}
                          </span>
                        </div>

                        {/* Message Body */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>

                        {/* Action controllers */}
                        <div className="flex items-center space-x-2 pt-2 self-end justify-end">
                          {!msg.read && (
                            <button
                              onClick={() => handleMarkRead(msg.id)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                            >
                              <Check size={12} />
                              <span>Mark Read</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('messages', msg.id)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      <p className="text-xs text-slate-400 font-mono">INBOX CLEAR • NO TRANSMISSIONS RECEIVED</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* BLOGS CMS MANAGER TAB */}
            {activeTab === 'blogs' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                  <h2 className="text-lg sm:text-xl font-display font-extrabold flex items-center space-x-2">
                    <BookOpen size={20} className="text-indigo-500" />
                    <span>Manage Articles (CMS)</span>
                  </h2>
                  <button
                    onClick={() => {
                      setBlogForm({ title: '', excerpt: '', content: '### Introduction\n\nWrite blog content here...', category: 'Development', tags: [], imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800', featured: false });
                      setEditingItem(null);
                      setShowAddForm(showAddForm === 'blog' ? null : 'blog');
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Publish Article</span>
                  </button>
                </div>

                {/* BLOG ADD/EDIT FORM */}
                {showAddForm === 'blog' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateOrUpdate('blogs', blogForm, !!editingItem, editingItem?.id);
                    }}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 mb-6"
                  >
                    <h3 className="font-display font-bold text-sm uppercase text-slate-400 mb-2">
                      {editingItem ? 'Edit Article Metadata' : 'Form: Post New Article'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Article Title</label>
                        <input
                          type="text"
                          required
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Category</label>
                        <input
                          type="text"
                          required
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Excerpt Summary</label>
                      <input
                        type="text"
                        required
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Image Asset URL</label>
                        <input
                          type="text"
                          required
                          value={blogForm.imageUrl}
                          onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(blogForm.tags) ? blogForm.tags.join(', ') : blogForm.tags}
                          onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value as any })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Reading Duration (e.g. 5 min read)</label>
                        <input
                          type="text"
                          value={blogForm.readingTime || '5 min read'}
                          onChange={(e) => setBlogForm({ ...blogForm, readingTime: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Article Content (Supports headings with ###)</label>
                      <textarea
                        rows={10}
                        required
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs font-mono text-slate-700 dark:text-slate-300"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer">
                        {editingItem ? 'Save Updates' : 'Add New Record'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(null);
                          setEditingItem(null);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* BLOG LIST ROWS */}
                <div className="space-y-3">
                  {data.blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 gap-4"
                    >
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{blog.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {blog.date} • {blog.views || 0} views • {blog.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setBlogForm(blog);
                            setEditingItem({ type: 'blogs', id: blog.id });
                            setShowAddForm('blog');
                          }}
                          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete('blogs', blog.id)}
                          className="p-2 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
