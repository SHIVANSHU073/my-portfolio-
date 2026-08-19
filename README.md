# Creative Developer Portfolio & Admin CMS

A high-performance, full-stack personal portfolio and content management dashboard built with React 19, TypeScript, Tailwind CSS, and Express.

---

## Features

### Public Portfolio
- **Modern Responsive Design**: Single-screen modular anchor navigation with smooth scrolling and interactive micro-animations.
- **Hero & Profile Showcase**: Dynamic headlines, quick stats, biography, and social links.
- **Interactive Experience & Education Timeline**: Chronological presentation of work history and educational background.
- **Categorized Skills Matrix**: Technical and soft skills with proficiency bars and category filters.
- **Project Showcase**: Rich project cards with search, category filtering, live demos, and GitHub repository links.
- **SeREADME.mdREADME.mdrvices & Offerings**: Structured service catalog with tiered offerings and direct inquiry actions.
- **Certificates & Verified Credentials**: Searchable certificates with direct verification links.
- **Blog & Article Engine**: Markdown-supported articles with estimated reading time, categories, and full-screen reading modal.
- **Testimonials & Endorsements**: Client reviews with ratings and company details.
- **FAQ Section**: Collapsible accordion interface addressing common questions.
- **Interactive Contact Form & Direct WhatsApp**: Client-side validated contact form saving messages directly to the server database.
- **Multi-Language Support**: Complete internationalization support for English, Spanish, and German.
- **Dark / Light Theme Toggle**: Persistent theme preference synced with system settings.

### Admin Dashboard & Management System
- **Secure Authentication**: Direct Sign In access with hashed password verification.
- **Real-Time Analytics Dashboard**: Page view telemetry, message volume trends, and visitor charts.
- **Full CRUD Management**: Edit profile data, timeline items, skills, projects, services, certificates, blogs, FAQs, and testimonials.
- **Message Inbox**: View incoming contact messages, mark as read, or delete inquiries.
- **Multi-User Management**: Role-based access (Super Admin & Admin) with user creation, role assignment, and deletion controls.
- **Profile & Password Settings**: In-dashboard password updates and profile information customization.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide Icons (`lucide-react`)
- **Backend**: Node.js, Express, `dotenv`, Crypto (PBKDF2 password hashing)
- **Bundler & Tooling**: Vite, `esbuild`, `tsx`, TypeScript Compiler (`tsc`)
- **Database**: Local JSON storage (`data.json`) with auto-bootstrap fallback

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development
Start the full-stack development server (Express backend + Vite HMR frontend):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### Production Build & Deployment
Build the client assets with Vite and bundle the server into a standalone CommonJS artifact with `esbuild`:
```bash
npm run build
```

Run the production server:
```bash
npm run start
```

### Linting
Run TypeScript type-checking:
```bash
npm run lint
```

---

## Project Structure

```
├── data.json                   # Application database file (auto-generated)
├── metadata.json               # Platform configuration and app capabilities
├── package.json                # Project dependencies and scripts
├── server.ts                   # Express backend server and API endpoints
├── index.html                  # HTML entry point
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Main application view & state coordinator
│   ├── types.ts                # TypeScript interfaces and data models
│   ├── index.css               # Global Tailwind CSS imports and theme rules
│   ├── assets/                 # Static images and icons
│   ├── components/             # React sub-components
│   │   ├── Navbar.tsx          # Navigation header and language/theme controls
│   │   ├── Home.tsx            # Hero presentation section
│   │   ├── About.tsx           # Biography and timeline section
│   │   ├── Skills.tsx          # Technical & soft skills matrix
│   │   ├── Projects.tsx        # Project showcase with filters
│   │   ├── Services.tsx        # Services and offerings
│   │   ├── Certificates.tsx    # Certifications and credentials
│   │   ├── Blog.tsx            # Insights, articles, and reading modal
│   │   ├── Testimonials.tsx    # Client reviews and ratings
│   │   ├── FAQ.tsx             # Interactive accordion FAQs
│   │   ├── Contact.tsx         # Contact form and location details
│   │   ├── Footer.tsx          # Footer and newsletter subscription
│   │   ├── AdminLogin.tsx      # Sign In authentication screen
│   │   └── AdminDashboard.tsx  # Admin CMS management suite
│   ├── data/
│   │   └── translations.ts     # Multi-language dictionary (en, es, de)
│   └── utils/
│       └── scroll.ts           # Smooth scroll helper utilities
└── vite.config.ts              # Vite configuration
```

---

## Default Admin Credentials

When the database is initialized for the first time, default credentials are created:
- **Username**: `admin`
- **Password**: `admin123`

*Note: You can change your password or add new users at any time inside the Admin Dashboard under the Settings tab.*

---

## License
Apache-2.0
