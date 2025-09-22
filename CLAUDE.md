# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhraseWorks is a full-stack content management system with a plugin architecture, built as a modern WordPress-like alternative. It features a React frontend and Node.js/Hono backend with GraphQL API, designed to run on Cloudflare Workers.

## Architecture

### Frontend (React/Vite)
- **Framework**: React 18.3.1 with React Router DOM 7.6.2
- **Build Tool**: Vite 6.3.1 with SWC
- **Styling**: TailwindCSS 3.4.4 with Flowbite components
- **State Management**: React Context API (APIConnectorContext, UserContext)
- **Rich Text**: TinyMCE integration

### Backend (Node.js/Hono)
- **Framework**: Hono 4.7.10 web framework
- **API**: GraphQL with custom resolvers
- **Database**: PostgreSQL via Cloudflare Hyperdrive
- **Storage**: Cloudflare R2 (S3-compatible)
- **Authentication**: JWT with custom middleware
- **WebSocket**: Real-time features on port 8081

## Common Commands

### Development
```bash
npm run install-all    # Install all dependencies (frontend & backend)
npm run dev            # Start both frontend (5173) & backend (8787) concurrently
```

### Frontend
```bash
cd frontend
npm run dev            # Development server at localhost:5173
npm run build          # Build to backend/dist directory
npm run lint           # ESLint checking
```

### Backend
```bash
cd backend
npm run dev            # Development server at localhost:8787
npm run deploy         # Deploy to Cloudflare Workers
npm run generate:plugins  # Regenerate plugin GraphQL resolvers
```

## Key Directory Structure

```
frontend/src/
├── Admin/             # Admin interface components
├── API/               # API connection utilities  
├── Content/           # Theme/content components
├── Contexts/          # React contexts (User, APIConnector)
├── Plugins/           # Frontend plugin system
└── Utils/             # Utility functions

backend/src/
├── graphql/           # GraphQL schema & resolvers
├── middleware/        # Auth, DB, rate limiting middleware
├── models/            # Data models
├── plugins/           # Backend plugin system
└── utils/             # Database loaders, actions, cron jobs
```

## Plugin Architecture

PhraseWorks uses a dual plugin system requiring both frontend and backend plugins:

**Backend Plugin Structure:**
```
backend/src/plugins/pluginName/
├── index.js           # Plugin registration & hooks
├── resolvers.js       # GraphQL resolvers
└── schema.js          # GraphQL type definitions
```

**Frontend Plugin Structure:**
```
frontend/src/Plugins/pluginName/
├── index.js           # Plugin registration
├── Pages/             # Admin pages
├── Components/        # Reusable components
└── API/               # API connectors
```

Key plugin features:
- Hook system via `doAction`/`addAction` for extensibility
- Admin menu integration with dynamic routing
- Meta boxes for post/page editing
- Custom GraphQL endpoints

## Development Workflow

1. **Setup**:
   - Run `npm run install-all` to install dependencies
   - Copy `.env.example` to `.env` and configure with your actual credentials
   - **IMPORTANT**: Never commit real secrets to version control
2. **Development**: Use `npm run dev` to start both servers concurrently
3. **Frontend Development**: Access localhost:5173 for live reload
4. **Backend Testing**: Access localhost:8787 for production-like environment
5. **Build Process**: Frontend builds to `backend/dist`, backend serves static files

## Environment Setup

**Security Notice**: The `.env` file contains placeholder values only. For actual development:

1. Copy `.env.example` to `.env`
2. Replace placeholder values with your actual credentials:
   - Generate strong random strings for `SECRET_KEY` and `AUTH_SECRET`
   - Configure your PostgreSQL database credentials
   - Set up Cloudflare R2 storage credentials
   - Configure SMTP settings for email functionality
3. Never commit the `.env` file with real credentials

## Configuration Files

- `frontend/vite.config.js` - Build optimization and development proxy settings
- `backend/.env` - Local development environment variables
- `docker-compose.yml` - PostgreSQL and application containers

## Database & Storage

- **Database**: PostgreSQL accessed via Cloudflare Hyperdrive for connection pooling
- **Storage**: Cloudflare R2 for media files with public URL access
- **Caching**: DataLoader pattern for GraphQL query optimization
- **Authentication**: JWT tokens with custom middleware

## Build & Deployment

**Local Development:**
1. Frontend builds to `backend/dist` directory
2. Backend serves built frontend from `/dist`

**Production Deployment:**
1. Build frontend: `cd frontend && npm run build`
2. Deploy to Cloudflare Workers: `cd backend && npm run deploy`

## Key Technologies

- **Frontend**: React, Vite, TailwindCSS, GraphQL client
- **Backend**: Hono, GraphQL, PostgreSQL, Cloudflare Workers
- **Storage**: Cloudflare R2, Sharp/Photon for image processing
- **Real-time**: WebSocket server on port 8081
- **Email**: Multi-provider support (Resend, Mailgun, NodeMailer)