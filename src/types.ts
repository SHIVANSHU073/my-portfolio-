/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  name: string;
  titles: string[]; // for typewriter effect
  bioShort: string;
  bioLong: string;
  photoUrl: string;
  resumeUrl: string;
  email: string;
  phone: string;
  location: string;
  whatsappNumber: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram?: string;
  };
  languages: { code: string; label: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}

export interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  roleOrDegree: string;
  organization: string;
  period: string;
  description: string;
  iconName?: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  iconName: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Technical' | 'Soft';
  subcategory: string; // e.g. Frontend, Backend, Design
  level: number; // 0-100
  iconName: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  price: string;
  features: string[];
  popular: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  credentialUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: string;
  date: string;
  imageUrl: string;
  featured: boolean;
  views: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  rating: number; // 1-5
  imageUrl: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PageViewMetric {
  path: string;
  count: number;
}

export interface Analytics {
  totalVisits: number;
  totalMessages: number;
  pageViews: Record<string, number>;
  messagesByDate: Record<string, number>; // date string -> count
  visitsByDate: Record<string, number>; // date string -> count
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'Super Admin' | 'Test User';
  name: string;
}

export interface PortfolioData {
  profile: Profile;
  timeline: TimelineItem[];
  stats: StatItem[];
  skills: Skill[];
  projects: Project[];
  services: Service[];
  certificates: Certificate[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  messages: ContactMessage[];
  analytics: Analytics;
  users?: User[];
}
