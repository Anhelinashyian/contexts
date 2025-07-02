# Contexts - React Task Management App

## Overview

Contexts is a full-stack task management application built with React, TypeScript, and Express. The application allows users to create and manage tasks through a clean, keyboard-driven interface. Users can press Enter anywhere on the page to create new tasks via a modal form.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Validation**: Zod schemas for runtime type checking
- **Development**: Hot reload with Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations
- **Fallback Storage**: In-memory storage for development/testing

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Contexts Table**: Context categories (id, name, color) for organizing tasks
- **Tasks Table**: Task management (id, name, description, comments, contextId)
- **Validation**: Zod schemas with business rules (name max 50 chars, description max 200 chars)

### API Endpoints
- `GET /api/contexts` - Retrieve all contexts
- `POST /api/contexts` - Create new context (or return existing if name exists)
- `GET /api/tasks` - Retrieve all tasks with context information
- `GET /api/tasks/:id` - Retrieve single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task

### Frontend Components
- **TaskModal**: Form modal for creating/editing tasks
- **Home Page**: Main dashboard with task listing and keyboard shortcuts
- **UI Components**: Comprehensive set of shadcn/ui components for consistent design

### Key Features
- **Context Management**: Create and organize tasks by contexts with color-coded categories
- **Intelligent Context Selection**: Dropdown with existing contexts plus ability to create new ones
- **Board Layout**: Visual card-based display grouping tasks by context
- **Keyboard Navigation**: Global Enter key to open task creation modal
- **Form Validation**: Client and server-side validation with error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: User feedback for actions and errors

## Data Flow

1. **Task Creation**: User presses Enter → TaskModal opens → Form submission → API validation → Database storage → UI update
2. **Task Retrieval**: Page load → React Query fetch → API endpoint → Database query → UI rendering
3. **Real-time Updates**: Optimistic updates with React Query cache management

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe SQL query builder
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation
- **wouter**: Lightweight routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **tsx**: TypeScript execution for Node.js
- **vite**: Build tool and dev server
- **drizzle-kit**: Database migration tool
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle Kit applies schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment flag for development/production modes

### Production Setup
- Frontend served as static files from Express
- Backend API runs on same server for simplified deployment
- Database migrations run automatically on deployment

## Changelog

```
Changelog:
- July 02, 2025: Enhanced context management system
  - Added contexts table with color-coded categories  
  - Implemented context dropdown with custom input for creating new contexts
  - Created board layout showing tasks organized by context
  - Updated task schema to use contextId instead of plain text
- July 02, 2025: Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```