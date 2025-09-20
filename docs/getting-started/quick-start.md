# Quick Start Guide

Get PhraseWorks running on your local machine in minutes.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **PostgreSQL 15+** ([Download here](https://www.postgresql.org/download/))
- **Git** ([Download here](https://git-scm.com/downloads))
- **Docker** (optional, for easier database setup)

## Installation

### Option 1: Quick Setup with Docker

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/phraseworks.git
cd phraseworks

# 2. Install dependencies
npm run install-all

# 3. Start services with Docker
docker-compose up -d

# 4. Start development servers
npm run dev
```

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/phraseworks.git
cd phraseworks

# 2. Install dependencies
npm run install-all

# 3. Set up PostgreSQL database
createdb phraseworks

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Start development servers
npm run dev
```

## Environment Configuration

Edit your `.env` file with your specific settings:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=phraseworks
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-here
AUTH_SECRET=another-secret-key-for-auth

# Cloudflare R2 Storage (optional)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Email Configuration (optional)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# Redis Configuration (optional, for caching)
REDIS_URL=redis://localhost:6379
```

⚠️ **Security Note**: Never commit your `.env` file to version control. Use `.env.example` as a template.

## First Run

1. **Start the development servers**:
   ```bash
   npm run dev
   ```

2. **Access your installation**:
   - **Frontend Development**: http://localhost:5173 (with hot reload)
   - **Production Build**: http://localhost:8787 (served by backend)
   - **API Endpoint**: http://localhost:8787/graphql

3. **Complete the setup**:
   - The first time you access the application, you'll be prompted to set up the database
   - Create an admin user account
   - Configure basic site settings

## Development Workflow

### Frontend Development
```bash
# In the frontend directory
cd frontend

# Start development server with hot reload
npm run dev

# Build for production
npm run build
```

### Backend Development
```bash
# In the backend directory
cd backend

# Start development server
npm run dev

# Run with Docker services
npm run dev-docker-backend
```

### Working with Plugins
```bash
# After making plugin changes, regenerate plugin metadata
cd backend
npm run generate:plugins
```

## Project Structure Overview

```
phraseworks/
├── 📁 frontend/          # React application
│   ├── 📁 src/
│   │   ├── 📁 Admin/     # Admin interface
│   │   ├── 📁 Content/   # Frontend themes
│   │   ├── 📁 Plugins/   # Frontend plugins
│   │   └── 📁 Utils/     # Utilities
│   └── 📄 vite.config.js # Build configuration
├── 📁 backend/           # Node.js API
│   ├── 📁 src/
│   │   ├── 📁 graphql/   # GraphQL schema & resolvers
│   │   ├── 📁 models/    # Data models
│   │   ├── 📁 plugins/   # Backend plugins
│   │   └── 📁 middleware/# Express middleware
│   └── 📄 package.json
├── 📁 docs/             # Documentation
├── 📄 docker-compose.yml# Docker services
└── 📄 package.json     # Root package file
```

## Common Commands

### Root Level Commands
```bash
npm run dev              # Start both frontend and backend
npm run install-all      # Install all dependencies
```

### Frontend Commands
```bash
cd frontend
npm run dev              # Development server
npm run build            # Production build
npm run lint             # Lint code
npm run preview          # Preview production build
```

### Backend Commands
```bash
cd backend
npm run dev              # Development server
npm run deploy           # Deploy to Cloudflare Workers
npm run generate:plugins # Regenerate plugin metadata
```

### Docker Commands
```bash
docker-compose up -d     # Start services in background
docker-compose down      # Stop services
docker-compose logs      # View logs
docker-compose pull      # Update images
```

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Kill process on port 5173
npx kill-port 5173

# Kill process on port 8787
npx kill-port 8787
```

**Database connection failed**:
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Plugin not loading**:
```bash
# Regenerate plugin metadata
cd backend
npm run generate:plugins
```

**Build fails**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm run install-all
```

## Next Steps

Now that you have PhraseWorks running:

1. **Explore the Admin Interface**: Visit http://localhost:5173/admin
2. **Read the Plugin Guide**: Explore the **Plugin Development** section for comprehensive guides
3. **Check out the API**: See the **API Reference** section for complete GraphQL documentation
4. **Learn the Architecture**: Check the **Architecture Overview** in this Getting Started section

## Getting Help

- 📚 **Documentation**: Use the navigation menu to explore all sections
- 🐛 **Report Issues**: https://github.com/yourusername/phraseworks/issues
- 💬 **Community Forum**: https://community.phraseworks.com
- 📧 **Email Support**: support@phraseworks.com

Happy coding! 🚀