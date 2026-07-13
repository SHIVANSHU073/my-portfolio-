/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { PortfolioData, Profile, TimelineItem, StatItem, Skill, Project, Service, Certificate, BlogPost, Testimonial, FAQ, ContactMessage, Analytics } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'data.json');

app.use(express.json());

// Initialize default portfolio data if data.json does not exist
function getInitialData(): PortfolioData {
  return {
    profile: {
      name: "Shivanshu",
      titles: [
        "Senior Full-Stack Developer",
        "Creative UI/UX Designer",
        "Technical Architect",
        "Open Source Advocate"
      ],
      bioShort: "Building immersive digital experiences at the intersection of robust backend systems and gorgeous, high-performance user interfaces.",
      bioLong: "Hi, I'm Shivanshu. With over 8 years of professional experience, I help companies turn complex technical challenges into pixel-perfect, highly scalable, and accessible web solutions. I specialize in React, Node.js, Cloud Architectures, and motion design. When I'm not coding, I'm mentoring junior developers, speaking at tech meetups, or researching web performance. My philosophy is simple: write clean, self-documenting code, design with absolute focus on user empathy, and never stop learning.",
      photoUrl: "/src/assets/images/shivanshu_user_photo_1783946269786.jpg",
      resumeUrl: "#", // Mock download link
      email: "shivanshu@designcode.io",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      whatsappNumber: "15552345678",
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com"
      },
      languages: [
        { code: "en", label: "English" },
        { code: "es", label: "Spanish" },
        { code: "de", label: "German" }
      ],
      seo: {
        title: "Shivanshu | Senior Creative Developer Portfolio",
        description: "Professional portfolio of Shivanshu, a senior full-stack developer and creative designer specializing in high-fidelity React, Node.js, and modern UI/UX.",
        keywords: "Full Stack Developer, UI/UX Designer, React Portfolio, TypeScript Developer, Creative Tech",
        ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
      }
    },
    timeline: [
      {
        id: "exp-1",
        type: "experience",
        roleOrDegree: "Lead Creative Technologist",
        organization: "Vortex Labs Inc.",
        period: "2023 - Present",
        description: "Architecting micro-frontend platforms, driving UI/UX consistency across 4 separate core product lines, and leading a cross-functional team of 12 designers and developers.",
        iconName: "Briefcase"
      },
      {
        id: "exp-2",
        type: "experience",
        roleOrDegree: "Senior Full-Stack Engineer",
        organization: "Aetherial AI",
        period: "2020 - 2023",
        description: "Engineered high-performance real-time analytics dashboards. Implemented serverless Node.js REST and GraphQL endpoints handling 10M+ daily requests. Boosted web performance core vitals by 42%.",
        iconName: "Briefcase"
      },
      {
        id: "exp-3",
        type: "experience",
        roleOrDegree: "UI/UX Software Developer",
        organization: "PixelCraft Agency",
        period: "2018 - 2020",
        description: "Collaborated closely with visual designers to develop accessible, interactive, and highly animated customer-facing interfaces for Fortune 500 brands using React and GSAP.",
        iconName: "Briefcase"
      },
      {
        id: "edu-1",
        type: "education",
        roleOrDegree: "Master of Science in Computer Science",
        organization: "Stanford University",
        period: "2016 - 2018",
        description: "Specialized in Human-Computer Interaction (HCI) and Distributed Systems. Published research paper on interactive data visualizers.",
        iconName: "GraduationCap"
      },
      {
        id: "edu-2",
        type: "education",
        roleOrDegree: "Bachelor of Science in Software Engineering",
        organization: "UC Berkeley",
        period: "2012 - 2016",
        description: "Graduated with Honors. Core curriculum included Algorithms, Database Design, Graphic Communications, and Machine Learning.",
        iconName: "GraduationCap"
      }
    ],
    stats: [
      { id: "stat-1", label: "Years of Experience", value: "8+", iconName: "Calendar" },
      { id: "stat-2", label: "Completed Projects", value: "120+", iconName: "Code2" },
      { id: "stat-3", label: "Happy Clients", value: "45+", iconName: "Users" },
      { id: "stat-4", label: "Coffee Consumed", value: "1.2K+", iconName: "Coffee" }
    ],
    skills: [
      { id: "skill-1", name: "React / Next.js", category: "Technical", subcategory: "Frontend", level: 95, iconName: "Atom" },
      { id: "skill-2", name: "TypeScript", category: "Technical", subcategory: "Languages", level: 90, iconName: "FileJson" },
      { id: "skill-3", name: "Node.js / Express", category: "Technical", subcategory: "Backend", level: 88, iconName: "Server" },
      { id: "skill-4", name: "Tailwind CSS", category: "Technical", subcategory: "Frontend", level: 98, iconName: "Sparkles" },
      { id: "skill-5", name: "PostgreSQL / Prisma", category: "Technical", subcategory: "Database", level: 85, iconName: "Database" },
      { id: "skill-6", name: "AWS / Cloud Infrastructure", category: "Technical", subcategory: "DevOps", level: 80, iconName: "Cloud" },
      { id: "skill-7", name: "UI/UX Design", category: "Soft", subcategory: "Creative", level: 92, iconName: "Layers" },
      { id: "skill-8", name: "Figma Prototyping", category: "Technical", subcategory: "Design", level: 90, iconName: "Paintbrush" },
      { id: "skill-9", name: "Team Leadership", category: "Soft", subcategory: "Professional", level: 85, iconName: "Users2" },
      { id: "skill-10", name: "Communication", category: "Soft", subcategory: "Personal", level: 95, iconName: "MessageCircle" },
      { id: "skill-11", name: "Problem Solving", category: "Soft", subcategory: "Personal", level: 92, iconName: "Brain" },
      { id: "skill-12", name: "Public Speaking", category: "Soft", subcategory: "Professional", level: 80, iconName: "Speech" }
    ],
    projects: [
      {
        id: "proj-1",
        title: "Aetheria Commerce Platform",
        description: "A headless, high-performance modern e-commerce storefront utilizing next-gen server components, localized caching, and micro-animations.",
        category: "E-Commerce",
        tags: ["React", "Next.js", "Tailwind CSS", "Stripe API"],
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800&auto=format&fit=crop",
        liveUrl: "https://example.com/demo1",
        githubUrl: "https://github.com",
        featured: true,
        order: 1
      },
      {
        id: "proj-2",
        title: "Vortex Real-time Analytics Engine",
        description: "Engineered a low-latency real-time telemetry dashboard using standard web sockets, SVG visualizations, and highly optimized data compression.",
        category: "Analytics",
        tags: ["TypeScript", "D3.js", "Node.js", "WebSockets"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        liveUrl: "https://example.com/demo2",
        githubUrl: "https://github.com",
        featured: true,
        order: 2
      },
      {
        id: "proj-3",
        title: "Scribe Markdown CMS",
        description: "A minimal, responsive blog writing platform featuring real-time markdown parsing, asset uploads, static site generation, and multi-language presets.",
        category: "SaaS",
        tags: ["React", "Express", "Tailwind CSS", "Marked"],
        imageUrl: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=800&auto=format&fit=crop",
        liveUrl: "https://example.com/demo3",
        githubUrl: "https://github.com",
        featured: false,
        order: 3
      },
      {
        id: "proj-4",
        title: "NeonSpace Game Server Client",
        description: "An interactive, sci-fi themed workspace launcher and connection broker applet for multi-user multiplayer indie game servers.",
        category: "Gaming",
        tags: ["Vite", "Canvas API", "Tailwind", "Socket.IO"],
        imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
        liveUrl: "https://example.com/demo4",
        githubUrl: "https://github.com",
        featured: false,
        order: 4
      }
    ],
    services: [
      {
        id: "srv-1",
        title: "Full-Stack Web Development",
        description: "End-to-end engineering of fast, responsive, and robust web systems. I handle everything from database schema design to seamless browser interactions.",
        iconName: "Cpu",
        price: "$2,500+",
        features: [
          "Custom API and database architecture",
          "Responsive, pixel-perfect frontend layouts",
          "Web performance optimization (95+ Core Vitals)",
          "1 Month of post-deployment support"
        ],
        popular: true
      },
      {
        id: "srv-2",
        title: "Premium UI/UX Design",
        description: "High-fidelity digital designs, Figma wireframing, and interactive layouts aligned strictly with modern typography and accessibility (WCAG) guidelines.",
        iconName: "Palette",
        price: "$1,800+",
        features: [
          "Deep user research and user flows",
          "High-fidelity Figma prototypes",
          "Complete Design System with UI tokens",
          "Mobile, Tablet, and Desktop adaptations"
        ],
        popular: false
      },
      {
        id: "srv-3",
        title: "Performance Audits & Mentorship",
        description: "Evaluating your existing web stack to identify performance bottlenecks, SEO errors, security risks, and guiding your engineering team toward modern patterns.",
        iconName: "LineChart",
        price: "$1,200",
        features: [
          "Complete Lighthouse & performance diagnostics",
          "Detailed remediation report with code snippets",
          "2h interactive team training session",
          "SEO and OpenGraph blueprint"
        ],
        popular: false
      }
    ],
    certificates: [
      {
        id: "cert-1",
        title: "Advanced React & Architecture",
        issuer: "React Training Group",
        date: "May 2024",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
        credentialUrl: "https://example.com/cert1"
      },
      {
        id: "cert-2",
        title: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services (AWS)",
        date: "November 2023",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
        credentialUrl: "https://example.com/cert2"
      },
      {
        id: "cert-3",
        title: "Human Computer Interaction Professional",
        issuer: "Interaction Design Foundation",
        date: "August 2022",
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop",
        credentialUrl: "https://example.com/cert3"
      }
    ],
    blogs: [
      {
        id: "blog-1",
        title: "Mastering React 19 Compiler and Server Components",
        excerpt: "An in-depth guide on how the automatic memoization engine and React Server Components change how we design, optimize, and bundle applications.",
        content: "### Introduction to React 19\n\nReact 19 marks a major leap forward for frontend software engineering, introduces the new React Compiler (React Forget), and officially integrates Server Components into the primary release branch.\n\n#### What is the React Compiler?\n\nHistorically, React developers had to manually optimize render cycles using hooks like `useMemo` and `useCallback`. With React 19, the compiler automatically detects component structures and injects cache boundaries at build-time. This eliminates developer fatigue and prevents unnecessary re-renders entirely.\n\n#### Key Architectural Changes:\n- **Server Components**: Run server-side to fetch data close to database layers, reducing browser Javascript payloads.\n- **Actions API**: Streamline pending states, error boundaries, and form submissions effortlessly.\n- **Custom Hooks**: Introducing `use` for consuming promises and contexts dynamically.\n\n*Mastering these core updates is essential for keeping applications blazing fast!*",
        category: "Development",
        tags: ["React 19", "WebPerf", "Frontend"],
        readingTime: "5 min read",
        date: "June 24, 2026",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        featured: true,
        views: 245
      },
      {
        id: "blog-2",
        title: "The Golden Rules of Premium UI Typography",
        excerpt: "Why default spacing looks robotic, and how selecting the right scale, line heights, and letter tracking elevates standard designs into masterpieces.",
        content: "### Typography: The Soul of UI Design\n\nDesigners often assume visual appeal comes from vibrant illustrations or heavy shadow depths. In reality, text layout makes up over 90% of user interface interactions.\n\n#### Rule 1: Choose Intentional Typography Pairings\nPairing a Display font (like **Space Grotesk**) for display headings with a Highly readable body font (like **Inter**) establishes perfect tension and visual rhythm.\n\n#### Rule 2: Tame the Line Height\nAs font sizes increase, line-height needs to compress. Body copy (16px) works beautifully at `1.5` to `1.625` line heights, whereas display titles (48px) should be set around `1.1` to `1.2` tracking closely.\n\n#### Rule 3: Space Grotesk Tracking\nGrotesk display headers require compact or negative tracking to feel unified. Setting `tracking-tight` on h1/h2 headings tightens the glyph architecture, establishing a high-end editorial atmosphere.",
        category: "Design",
        tags: ["Typography", "UI/UX", "Aesthetics"],
        readingTime: "4 min read",
        date: "May 18, 2026",
        imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
        featured: false,
        views: 189
      },
      {
        id: "blog-3",
        title: "Building Microservices with Node.js and CJS Bundle Formats",
        excerpt: "How to deploy reliable containerized servers on Cloud Run without hitting strict native ESM relative path resolutions.",
        content: "### Full-Stack Architecture in Modern Containers\n\nWhen deploying containerized apps (like those running on Cloud Run), we frequently hit path resolution hurdles in modern ESM. This is why bundling the server application into a single self-contained CommonJS (`dist/server.cjs`) using `esbuild` is a production best-practice.\n\n#### Why CJS Bundles Outperform Raw TypeScript in Production:\n- **Instant Boot Times**: Eliminates cold-start filesystem lookups across hundreds of node_modules directories.\n- **Error Avoidance**: Resolves paths at build-time rather than runtime.\n- **Single Artifact**: Simplifies deployments to a solitary file.\n\nImplementing high-performance server architectures becomes trivial once deployment obstacles are solved.",
        category: "Architecture",
        tags: ["Node.js", "CloudRun", "Express"],
        readingTime: "6 min read",
        date: "March 11, 2026",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
        featured: false,
        views: 120
      }
    ],
    testimonials: [
      {
        id: "test-1",
        name: "Sarah Jenkins",
        role: "VP of Product",
        company: "Vortex Labs Inc.",
        review: "Shivanshu is an absolute rare find in software engineering: a deeply experienced technical mind with an outstanding visual design aesthetic. Our product redesign saw a 30% increase in user retention immediately upon launch.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "test-2",
        name: "Marcus Aureli",
        role: "Founder",
        company: "Aetherial AI",
        review: "The telemetry dashboard built by Shivanshu runs at constant 60fps even with millions of real-time datapoints. Excellent code hygiene, exceptional communication throughout, and absolute dedication to details.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "test-3",
        name: "Elena Rostova",
        role: "Director of Brand",
        company: "PixelCraft Agency",
        review: "Shivanshu transformed our visual concepts into flawless responsive CSS. Responsive transitions are incredibly smooth, layout shifts are non-existent, and the accessible elements are fully compliant with WCAG directives.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
      }
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Do you offer full-time contract hires or purely project freelancing?",
        answer: "I offer both! I regularly contract for 3 to 6-month product sprints as a Lead/Senior Creative Engineer. I also undertake standalone high-fidelity design-to-code project commissions. Let's discuss your timeline!"
      },
      {
        id: "faq-2",
        question: "What is your typical project delivery lifecycle?",
        answer: "Every engagement starts with user mapping and visual architecture (Figma), followed by technical staging, robust frontend development (React/TS), and end-to-end load testing. We finish with complete core web vitals optimization and seamless cloud staging."
      },
      {
        id: "faq-3",
        question: "Are your interfaces compliant with accessibility (ADA/WCAG) standards?",
        answer: "Absolutely. Accessible design is non-negotiable. I use proper semantic structures, ensure clean ARIA labels, support full keyboard navigability, and maintain WCAG AAA compliant color ratios throughout."
      },
      {
        id: "faq-4",
        question: "How do you handle backend integrations or data persistent storage?",
        answer: "I structure clean RESTful and GraphQL architectures. Depending on the scale, I integrate PostgreSQL database layers with Prisma/Drizzle ORMs, or secure serverless storage such as Google Firestore."
      }
    ],
    messages: [
      {
        id: "msg-1",
        name: "Clara Adams",
        email: "clara.adams@test.com",
        subject: "Stunning Web Dashboard project",
        message: "Hi Shivanshu, we saw your high-end performance audits and custom SaaS dashboard. We are looking for a senior developer to build our next telemetry dashboard. Let's sync up this Wednesday!",
        date: "2026-07-12T14:32:00.000Z",
        read: false
      }
    ],
    analytics: {
      totalVisits: 1420,
      totalMessages: 12,
      pageViews: {
        "home": 620,
        "about": 320,
        "projects": 280,
        "blog": 140,
        "services": 60,
        "contact": 100
      },
      messagesByDate: {
        "2026-07-08": 1,
        "2026-07-10": 2,
        "2026-07-12": 1
      },
      visitsByDate: {
        "2026-07-08": 110,
        "2026-07-09": 140,
        "2026-07-10": 135,
        "2026-07-11": 150,
        "2026-07-12": 165,
        "2026-07-13": 85
      }
    }
  };
}

// Load data helper
function loadData(): PortfolioData {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as PortfolioData;
  } catch (err) {
    console.error("Error reading data.json. Bootstrapping initial.", err);
    return getInitialData();
  }
}

// Save data helper
function saveData(data: PortfolioData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Secure admin authentication middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'mock-admin-token-rivers-882') {
    res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
    return;
  }
  next();
}

// PUBLIC API: Get Portfolio Data
app.get('/api/portfolio', (req, res) => {
  const fullData = loadData();
  // Safe representation (hide messages, hide analytics breakdown to keep memory clean)
  const safeData = {
    profile: fullData.profile,
    timeline: fullData.timeline,
    stats: fullData.stats,
    skills: fullData.skills,
    projects: fullData.projects,
    services: fullData.services,
    certificates: fullData.certificates,
    blogs: fullData.blogs,
    testimonials: fullData.testimonials,
    faqs: fullData.faqs,
  };
  res.json(safeData);
});

// PUBLIC API: Submit Contact Message
app.post('/api/portfolio/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: 'Bad Request: All fields (name, email, subject, message) are required.' });
    return;
  }

  const fullData = loadData();
  
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    subject,
    message,
    date: new Date().toISOString(),
    read: false
  };

  fullData.messages.push(newMessage);
  fullData.analytics.totalMessages += 1;

  // Track messages in daily analytics
  const dateStr = new Date().toISOString().split('T')[0];
  fullData.analytics.messagesByDate[dateStr] = (fullData.analytics.messagesByDate[dateStr] || 0) + 1;

  saveData(fullData);
  res.json({ success: true, message: 'Message recorded successfully!', data: newMessage });
});

// PUBLIC API: Track page views
app.post('/api/portfolio/track', (req, res) => {
  const { pathName } = req.body;
  if (!pathName) {
    res.status(400).json({ error: 'Path name required' });
    return;
  }

  const fullData = loadData();
  
  // Clean path names (e.g., "/" -> "home")
  let cleanKey = pathName.replace(/^\//, '') || 'home';
  cleanKey = cleanKey.split('/')[0]; // just get top-level component

  fullData.analytics.totalVisits += 1;
  fullData.analytics.pageViews[cleanKey] = (fullData.analytics.pageViews[cleanKey] || 0) + 1;

  const dateStr = new Date().toISOString().split('T')[0];
  fullData.analytics.visitsByDate[dateStr] = (fullData.analytics.visitsByDate[dateStr] || 0) + 1;

  saveData(fullData);
  res.json({ success: true, totalVisits: fullData.analytics.totalVisits });
});

// PUBLIC API: Increment Blog View Counter
app.post('/api/portfolio/blogs/:id/view', (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const blog = fullData.blogs.find(b => b.id === id);
  if (blog) {
    blog.views = (blog.views || 0) + 1;
    saveData(fullData);
    res.json({ success: true, views: blog.views });
  } else {
    res.status(404).json({ error: 'Blog post not found' });
  }
});

// ADMIN API: Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Default values
  const defaultUser = process.env.ADMIN_USER || 'admin';
  const defaultPass = process.env.ADMIN_PASS || 'admin123';

  if (username === defaultUser && password === defaultPass) {
    res.json({ 
      success: true, 
      token: 'mock-admin-token-rivers-882',
      profile: {
        username: 'admin',
        role: 'Administrator'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// ADMIN API: Fetch complete data including messages and analytics
app.get('/api/admin/data', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  res.json(fullData);
});

// ADMIN API: Save Profile
app.put('/api/admin/profile', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  fullData.profile = { ...fullData.profile, ...req.body };
  saveData(fullData);
  res.json({ success: true, profile: fullData.profile });
});

// ADMIN API: TIMELINE Management
app.post('/api/admin/timeline', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: TimelineItem = {
    id: `timeline-${Date.now()}`,
    ...req.body
  };
  fullData.timeline.unshift(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/timeline/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.timeline.findIndex(t => t.id === id);
  if (idx !== -1) {
    fullData.timeline[idx] = { ...fullData.timeline[idx], ...req.body, id };
    saveData(fullData);
    res.json({ success: true, data: fullData.timeline[idx] });
  } else {
    res.status(404).json({ error: 'Timeline item not found' });
  }
});

app.delete('/api/admin/timeline/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.timeline = fullData.timeline.filter(t => t.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: SKILLS Management
app.post('/api/admin/skills', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: Skill = {
    id: `skill-${Date.now()}`,
    ...req.body,
    level: Number(req.body.level || 80)
  };
  fullData.skills.push(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/skills/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.skills.findIndex(s => s.id === id);
  if (idx !== -1) {
    fullData.skills[idx] = { ...fullData.skills[idx], ...req.body, id, level: Number(req.body.level) };
    saveData(fullData);
    res.json({ success: true, data: fullData.skills[idx] });
  } else {
    res.status(404).json({ error: 'Skill not found' });
  }
});

app.delete('/api/admin/skills/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.skills = fullData.skills.filter(s => s.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: PROJECTS Management
app.post('/api/admin/projects', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: Project = {
    id: `proj-${Date.now()}`,
    ...req.body,
    featured: !!req.body.featured,
    order: Number(req.body.order || fullData.projects.length + 1),
    tags: Array.isArray(req.body.tags) ? req.body.tags : String(req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean)
  };
  fullData.projects.push(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/projects/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    const tagsParsed = Array.isArray(req.body.tags) ? req.body.tags : String(req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    fullData.projects[idx] = {
      ...fullData.projects[idx],
      ...req.body,
      id,
      featured: !!req.body.featured,
      order: Number(req.body.order || 1),
      tags: tagsParsed
    };
    saveData(fullData);
    res.json({ success: true, data: fullData.projects[idx] });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/api/admin/projects/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.projects = fullData.projects.filter(p => p.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: SERVICES Management
app.post('/api/admin/services', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: Service = {
    id: `srv-${Date.now()}`,
    ...req.body,
    popular: !!req.body.popular,
    features: Array.isArray(req.body.features) ? req.body.features : String(req.body.features || '').split('\n').map(f => f.trim()).filter(Boolean)
  };
  fullData.services.push(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/services/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.services.findIndex(s => s.id === id);
  if (idx !== -1) {
    const featuresParsed = Array.isArray(req.body.features) ? req.body.features : String(req.body.features || '').split('\n').map(f => f.trim()).filter(Boolean);
    fullData.services[idx] = {
      ...fullData.services[idx],
      ...req.body,
      id,
      popular: !!req.body.popular,
      features: featuresParsed
    };
    saveData(fullData);
    res.json({ success: true, data: fullData.services[idx] });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

app.delete('/api/admin/services/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.services = fullData.services.filter(s => s.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: CERTIFICATES Management
app.post('/api/admin/certificates', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: Certificate = {
    id: `cert-${Date.now()}`,
    ...req.body
  };
  fullData.certificates.push(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/certificates/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.certificates.findIndex(c => c.id === id);
  if (idx !== -1) {
    fullData.certificates[idx] = { ...fullData.certificates[idx], ...req.body, id };
    saveData(fullData);
    res.json({ success: true, data: fullData.certificates[idx] });
  } else {
    res.status(404).json({ error: 'Certificate not found' });
  }
});

app.delete('/api/admin/certificates/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.certificates = fullData.certificates.filter(c => c.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: BLOGS Management
app.post('/api/admin/blogs', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: BlogPost = {
    id: `blog-${Date.now()}`,
    ...req.body,
    featured: !!req.body.featured,
    views: 0,
    tags: Array.isArray(req.body.tags) ? req.body.tags : String(req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  fullData.blogs.unshift(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/blogs/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.blogs.findIndex(b => b.id === id);
  if (idx !== -1) {
    const tagsParsed = Array.isArray(req.body.tags) ? req.body.tags : String(req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    fullData.blogs[idx] = {
      ...fullData.blogs[idx],
      ...req.body,
      id,
      featured: !!req.body.featured,
      tags: tagsParsed
    };
    saveData(fullData);
    res.json({ success: true, data: fullData.blogs[idx] });
  } else {
    res.status(404).json({ error: 'Blog post not found' });
  }
});

app.delete('/api/admin/blogs/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.blogs = fullData.blogs.filter(b => b.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: TESTIMONIALS Management
app.post('/api/admin/testimonials', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: Testimonial = {
    id: `test-${Date.now()}`,
    ...req.body,
    rating: Number(req.body.rating || 5)
  };
  fullData.testimonials.push(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/testimonials/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.testimonials.findIndex(t => t.id === id);
  if (idx !== -1) {
    fullData.testimonials[idx] = { ...fullData.testimonials[idx], ...req.body, id, rating: Number(req.body.rating) };
    saveData(fullData);
    res.json({ success: true, data: fullData.testimonials[idx] });
  } else {
    res.status(404).json({ error: 'Testimonial not found' });
  }
});

app.delete('/api/admin/testimonials/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.testimonials = fullData.testimonials.filter(t => t.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: FAQS Management
app.post('/api/admin/faqs', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  const newItem: FAQ = {
    id: `faq-${Date.now()}`,
    ...req.body
  };
  fullData.faqs.push(newItem);
  saveData(fullData);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/faqs/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const idx = fullData.faqs.findIndex(f => f.id === id);
  if (idx !== -1) {
    fullData.faqs[idx] = { ...fullData.faqs[idx], ...req.body, id };
    saveData(fullData);
    res.json({ success: true, data: fullData.faqs[idx] });
  } else {
    res.status(404).json({ error: 'FAQ not found' });
  }
});

app.delete('/api/admin/faqs/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.faqs = fullData.faqs.filter(f => f.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// ADMIN API: Messages operations
app.get('/api/admin/messages', authenticateAdmin, (req, res) => {
  const fullData = loadData();
  res.json(fullData.messages || []);
});

app.put('/api/admin/messages/:id/read', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  const msg = fullData.messages.find(m => m.id === id);
  if (msg) {
    msg.read = true;
    saveData(fullData);
    res.json({ success: true, data: msg });
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

app.delete('/api/admin/messages/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const fullData = loadData();
  fullData.messages = fullData.messages.filter(m => m.id !== id);
  saveData(fullData);
  res.json({ success: true });
});

// INTEGRATE VITE AS MIDDLEWARE (DEVELOPMENT) OR SERVE STATIC BUILD (PRODUCTION)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve client router fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Portfolio running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
