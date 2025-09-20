# Architecture Overview

PhraseWorks is built as a modern, full-stack content management system using cutting-edge web technologies. This document provides a comprehensive overview of the system architecture, design patterns, and technical decisions.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (Vite) │  Admin Interface │  Theme System   │
│  ├─ Components          │  ├─ Dashboard    │  ├─ Theme2025   │
│  ├─ Plugins            │  ├─ Posts/Pages  │  └─ Custom...   │
│  ├─ State Management   │  ├─ Media        │                 │
│  └─ API Client         │  └─ Settings     │                 │
└─────────────────────────────────────────────────────────────┘
                                │
                               ▼ GraphQL + REST
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Node.js Backend (Hono Framework)                          │
│  ├─ GraphQL Server        │  ├─ Authentication             │
│  ├─ REST Endpoints        │  ├─ Rate Limiting              │
│  ├─ File Upload Handler   │  ├─ CSRF Protection            │
│  ├─ WebSocket Server      │  └─ CORS Configuration         │
│  └─ Static File Server    │                                │
└─────────────────────────────────────────────────────────────┘
                                │
                               ▼ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database    │  Cloudflare R2     │  Redis Cache │
│  ├─ Posts & Pages       │  ├─ Media Files    │  ├─ Sessions │
│  ├─ Users & Roles       │  ├─ Uploads        │  ├─ Query    │
│  ├─ Categories/Tags     │  └─ Backups        │  └─ Results   │
│  ├─ Plugin Data        │                    │              │
│  └─ System Settings    │                    │              │
└─────────────────────────────────────────────────────────────┘
                                │
                               ▼ Plugin System
┌─────────────────────────────────────────────────────────────┐
│                  Plugin Architecture                        │
├─────────────────────────────────────────────────────────────┤
│  Backend Plugins         │  Frontend Plugins                │
│  ├─ GraphQL Extensions   │  ├─ React Components            │
│  ├─ Hook System          │  ├─ Admin Pages                 │
│  ├─ Database Models      │  ├─ Meta Boxes                  │
│  └─ API Resolvers        │  └─ Theme Extensions            │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Technologies

### Frontend Stack
- **React 18.3.1**: Component-based UI with hooks and modern patterns
- **Vite 6.3.1**: Lightning-fast build tool with SWC compilation
- **React Router DOM 7.6.2**: Client-side routing with future-ready features
- **TailwindCSS 3.4.4**: Utility-first CSS framework with JIT compilation
- **Flowbite**: Pre-built components for rapid development

### Backend Stack
- **Node.js 20+**: JavaScript runtime with modern ECMAScript support
- **Hono 4.9.7**: Fast, lightweight web framework for edge computing
- **GraphQL**: Type-safe API with introspection and tooling support
- **PostgreSQL 15+**: ACID-compliant relational database with JSON support
- **DataLoader**: Batch loading and caching to prevent N+1 queries

### Infrastructure
- **Cloudflare Workers**: Serverless computing at the edge
- **Cloudflare R2**: S3-compatible object storage
- **Redis**: In-memory caching and session storage
- **WebSockets**: Real-time bidirectional communication

## 🔧 Design Patterns

### 1. Plugin Architecture

PhraseWorks implements a **dual-plugin architecture** inspired by WordPress:

```javascript
// Backend Plugin Structure
export default {
  version: '1.0.0',
  name: 'Example Plugin',
  slug: 'examplePlugin',
  resolvers,    // GraphQL resolvers
  typeDefs,     // GraphQL schema
  init,         // Initialization function
  disable,      // Cleanup function
};

// Hook System
addAction('get_posts', (posts) => {
  return posts.filter(post => post.status === 'published');
});
```

**Benefits**:
- Hot-swappable plugins without server restart
- Schema composition for GraphQL extensions
- Event-driven architecture with hooks and filters

### 2. DataLoader Pattern

Prevents N+1 query problems with efficient batching:

```javascript
// Example: User loader batches multiple user queries
const userLoader = new DataLoader(async (userIds) => {
  const users = await connection`
    SELECT * FROM pw_users
    WHERE id = ANY(${userIds})
  `;
  return userIds.map(id => users.find(user => user.id === id));
});

// Usage in resolvers
const user = await userLoader.load(post.post_author);
```

**Benefits**:
- Automatic query batching and caching
- Reduced database load and improved response times
- Transparent to resolver logic

### 3. Context Pattern

Request context provides consistent access to shared resources:

```javascript
const context = {
  connection: sql,        // Database connection
  isAuth: true,          // Authentication status
  userId: 123,           // Current user ID
  loaders: {             // DataLoader instances
    user: userLoader,
    post: postLoader,
    // ...
  }
};
```

### 4. Middleware Chain

Request processing through composable middleware:

```javascript
app.use('/graphql',
  cors(corsConfig),           // CORS headers
  authMiddleware,             // JWT authentication
  dbMiddleware,               // Database connection
  cacheMiddleware({ ttl: 120 }), // Response caching
  rateLimit({ max: 400 }),    // Rate limiting
  csrfMiddleware,             // CSRF protection
);
```

## 📊 Data Flow

### 1. Request Lifecycle

```
Client Request
      ↓
   Middleware Chain
   ├─ CORS
   ├─ Authentication
   ├─ Database Connection
   ├─ Caching
   ├─ Rate Limiting
   └─ CSRF Protection
      ↓
   GraphQL Processing
   ├─ Query Parsing
   ├─ Validation
   ├─ Resolver Execution
   └─ Response Formatting
      ↓
   Response to Client
```

### 2. Plugin Integration Flow

```
Plugin Registration
      ↓
Schema Merging
├─ Core Schema
├─ Plugin Schemas
└─ Validation
      ↓
Resolver Composition
├─ Core Resolvers
├─ Plugin Resolvers
└─ Hook Integration
      ↓
Runtime Execution
```

### 3. Authentication Flow

```
Login Request
      ↓
Credential Validation
      ↓
JWT Token Generation
      ↓
HttpOnly Cookie Set
      ↓
Subsequent Requests
├─ Cookie Extraction
├─ JWT Verification
├─ User Context Setup
└─ Permission Checking
```

## 🔐 Security Architecture

### 1. Multi-Layer Security

- **Input Validation**: Schema-level validation with custom validators
- **Authentication**: JWT tokens with secure cookie storage
- **Authorization**: Role-based access control with capability checking
- **CSRF Protection**: Token-based protection for state-changing operations
- **Rate Limiting**: Request throttling with Redis backing
- **SQL Injection Prevention**: Parameterized queries with postgres.js
- **XSS Protection**: HTML sanitization with DOMPurify

### 2. Security Headers

```javascript
// Security middleware adds protective headers
headers: {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}
```

## ⚡ Performance Architecture

### 1. Caching Strategy

**Multi-Level Caching**:
```
L1: DataLoader Cache (Request-scoped)
      ↓
L2: Redis Cache (Shared, TTL-based)
      ↓
L3: Database Query Cache
      ↓
L4: CDN Edge Cache (Static assets)
```

### 2. Database Optimization

- **Connection Pooling**: Managed connections with postgres.js
- **Query Optimization**: Strategic indexes on frequently queried columns
- **Lazy Loading**: Related data loaded only when requested
- **Pagination**: Cursor and offset-based pagination support

### 3. Frontend Optimization

- **Code Splitting**: 20+ strategic chunks for optimal loading
- **Lazy Loading**: Route-level and component-level lazy loading
- **Tree Shaking**: Dead code elimination with Rollup
- **Asset Optimization**: Image compression and CDN delivery

## 🔄 State Management

### 1. Frontend State

```javascript
// React Context for global state
const UserContext = createContext();
const APIConnectorContext = createContext();

// Component-level state with hooks
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);
```

### 2. Backend State

- **Stateless Design**: No server-side session storage
- **Database State**: Persistent data in PostgreSQL
- **Cache State**: Temporary data in Redis
- **Plugin State**: Dynamic plugin activation/deactivation

## 🚀 Deployment Architecture

### 1. Serverless Deployment

```
Cloudflare Workers (Edge)
├─ Global distribution
├─ Auto-scaling
├─ Cold start optimization
└─ Built-in DDoS protection
      ↓
Hyperdrive (Database Proxy)
├─ Connection pooling
├─ Query caching
├─ Geographic optimization
└─ SSL termination
      ↓
PostgreSQL (Origin)
```

### 2. Asset Distribution

```
Static Assets → Cloudflare CDN
Media Files → R2 Storage → CDN
API Responses → Edge Caching
Database → Regional replicas
```

## 📈 Scalability Considerations

### 1. Horizontal Scaling

- **Stateless Architecture**: Workers can scale infinitely
- **Database Sharding**: Partition data by tenant or content type
- **CDN Distribution**: Global asset distribution
- **Plugin Isolation**: Plugins don't affect core scaling

### 2. Vertical Scaling

- **Database Optimization**: Query optimization and indexing
- **Memory Management**: Efficient object creation and garbage collection
- **CPU Optimization**: Async/await patterns for non-blocking operations

## 🛠️ Development Architecture

### 1. Project Structure

```
phraseworks/
├── frontend/src/
│   ├── Admin/           # Admin interface
│   ├── Content/         # Frontend themes
│   ├── Plugins/         # Client-side plugins
│   ├── Contexts/        # React contexts
│   └── Utils/           # Shared utilities
├── backend/src/
│   ├── graphql/         # Schema & resolvers
│   ├── models/          # Data models
│   ├── plugins/         # Server-side plugins
│   ├── middleware/      # Request middleware
│   └── utils/           # Server utilities
└── docs/               # Documentation
```

### 2. Build System

- **Frontend**: Vite with SWC for fast compilation
- **Backend**: Native Node.js modules with ES6 imports
- **Hot Reloading**: Instant updates during development
- **Production**: Optimized builds with minification

## 🔮 Future Architecture

### 1. Planned Enhancements

- **TypeScript Migration**: Gradual adoption for type safety
- **Microservices**: Plugin isolation with service boundaries
- **Event Sourcing**: Audit trail and data history
- **Multi-tenancy**: SaaS deployment with tenant isolation

### 2. Technology Evolution

- **Edge Computing**: Expanded Cloudflare Workers usage
- **AI Integration**: Content generation and optimization
- **Real-time Collaboration**: Operational transformation for concurrent editing
- **Progressive Web App**: Enhanced mobile experience

## 📚 Related Documentation

For more information, explore these related sections in the documentation:

- **Quick Start Guide** - Get started quickly with PhraseWorks
- **Plugin Development Guide** - Build plugins for PhraseWorks
- **GraphQL API Reference** - Complete API documentation
- **Production Deployment Guide** - Deploy to production environments

This architecture provides a solid foundation for a modern CMS while maintaining flexibility for future enhancements and scaling requirements.