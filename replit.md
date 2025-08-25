# Clash Royale Trainer

## Overview

This is a full-stack web application designed to help players improve their Clash Royale skills through training exercises and data analytics. The application combines card memorization training with real-time clan and tournament data from the official Clash Royale API. Built with a modern React frontend and Express.js backend, it offers both Portuguese and English language support and features a gaming-themed dark interface optimized for desktop, tablet, and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom gaming theme colors and responsive design
- **State Management**: TanStack Query for server state and React Context for client state
- **Internationalization**: Custom i18n implementation supporting Portuguese (pt-BR) and English (en-US)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Structure**: RESTful endpoints with proper error handling and logging

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Core Tables**:
  - Users table with permission levels (1=normal, 10=admin)
  - Cards table with multilingual support (PT/EN)
  - Training sessions table for score tracking
  - Sessions table for authentication state

### Authentication & Authorization
- **Provider**: Replit Auth with OAuth2/OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Permission System**: Role-based access (normal users vs administrators)
- **Security**: CSRF protection, secure cookies, IP-based API restrictions

### Training System Architecture
- **Grid Mode**: Visual card memorization with reveal/hide functionality
- **Simulation Mode**: Time-based random card testing with scoring
- **Progress Tracking**: Session history and performance analytics
- **Responsive Design**: Touch-optimized for mobile devices

### UI/UX Design System
- **Theme**: Custom gaming-inspired dark theme with orange accents
- **Typography**: Inter for body text, Roboto Condensed for headings, Oxanium for gaming elements
- **Responsive Strategy**: Mobile-first design with tablet and desktop breakpoints
- **Component Library**: Consistent design tokens and reusable components

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth service for OAuth2/OpenID Connect
- **Hosting**: Replit platform with automatic deployments

### Third-Party APIs
- **Clash Royale API**: Official Supercell API for real-time game data
  - Clan information and war logs
  - Player statistics and profiles
  - Tournament data and rankings
  - Rate-limited with IP restrictions

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, TanStack Query
- **UI Framework**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Development**: Vite, TypeScript, ESLint

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM, Neon serverless driver
- **Authentication**: Passport.js, OpenID Client
- **Utilities**: Zod for validation, memoizee for caching, connect-pg-simple for sessions

### Development Tools
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Database Tools**: Drizzle Kit for migrations and introspection
- **TypeScript**: Strict type checking with path mapping
- **Code Quality**: PostCSS for CSS processing, Tailwind plugins