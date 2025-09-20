# Production Deployment Guide

This guide covers deploying PhraseWorks to production environments, focusing on Cloudflare Workers, PostgreSQL, and R2 storage.

## 🎯 Deployment Architecture

PhraseWorks is designed for serverless deployment with the following components:
- **Frontend**: Static files served from Cloudflare Workers
- **Backend**: Node.js API deployed to Cloudflare Workers
- **Database**: PostgreSQL (via Cloudflare Hyperdrive for connection pooling)
- **Storage**: Cloudflare R2 for media files
- **Cache**: Redis (optional, for improved performance)

## 📋 Prerequisites

Before deploying, ensure you have:

- **Cloudflare Account** with Workers enabled
- **PostgreSQL Database** (managed service recommended)
- **Cloudflare R2 Bucket** for file storage
- **Redis Instance** (optional, for caching)
- **Domain Name** (optional, for custom domain)

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Environment

#### Create Cloudflare Resources

1. **Create R2 Bucket**:
   ```bash
   # Using Wrangler CLI
   wrangler r2 bucket create your-bucket-name
   ```

2. **Set up Hyperdrive** (for PostgreSQL connection pooling):
   ```bash
   wrangler hyperdrive create your-hyperdrive --connection-string="postgresql://user:password@host:port/dbname"
   ```

3. **Create KV Namespace** (for caching):
   ```bash
   wrangler kv:namespace create "PHRASEWORKS_CACHE"
   ```

#### Configure Environment Variables

Create a `.env.production` file:

```env
# Database Configuration (via Hyperdrive)
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=phraseworks_prod
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-secure-password

# JWT & Security
SECRET_KEY=your-super-secure-jwt-secret-key-32-chars-minimum
AUTH_SECRET=another-secure-secret-for-auth-operations

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-production-bucket
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Email Configuration (choose one provider)
# Option 1: Resend
RESEND_API_KEY=your-resend-api-key

# Option 2: Mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain

# Option 3: SMTP
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_SECURE=true

# Redis (optional, for caching)
REDIS_URL=redis://your-redis-host:6379

# Application Configuration
NODE_ENV=production
PHRASE_WORKS_VERSION=1.0.1
```

### 2. Create Wrangler Configuration

Create `backend/wrangler.toml`:

```toml
name = "phraseworks-api"
main = "src/index.js"
compatibility_date = "2024-01-01"
node_compat = true

[env.production]
name = "phraseworks-api-prod"

# Environment Variables
[env.production.vars]
NODE_ENV = "production"
PHRASE_WORKS_VERSION = "1.0.1"

# Secrets (set using wrangler secret put)
# SECRET_KEY = "..." (set via CLI)
# AUTH_SECRET = "..." (set via CLI)
# DATABASE_PASSWORD = "..." (set via CLI)

# Hyperdrive binding
[[env.production.hyperdrive]]
binding = "HYPERDRIVE"
id = "your-hyperdrive-id"

# R2 bucket binding
[[env.production.r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "your-production-bucket"

# KV namespace binding (optional)
[[env.production.kv_namespaces]]
binding = "CACHE_KV"
id = "your-kv-namespace-id"

# Durable Objects (if using WebSocket features)
[[env.production.durable_objects]]
name = "WebSocketHandler"
class_name = "WebSocketHandler"
script_name = "phraseworks-api-prod"

# Custom domain (optional)
[env.production.routes]
pattern = "api.yourdomain.com/*"
custom_domain = true
```

### 3. Set Production Secrets

Use Wrangler to securely set sensitive environment variables:

```bash
cd backend

# Set secrets for production environment
wrangler secret put SECRET_KEY --env production
wrangler secret put AUTH_SECRET --env production
wrangler secret put DATABASE_PASSWORD --env production
wrangler secret put R2_ACCESS_KEY_ID --env production
wrangler secret put R2_SECRET_ACCESS_KEY --env production

# Email secrets (choose your provider)
wrangler secret put RESEND_API_KEY --env production
# OR
wrangler secret put MAILGUN_API_KEY --env production
# OR
wrangler secret put SMTP_PASS --env production

# Redis (if using)
wrangler secret put REDIS_URL --env production
```

### 4. Prepare Database

#### Database Migration Script

Create `backend/scripts/migrate-production.js`:

```javascript
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.production' });

const sql = postgres({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

async function runMigrations() {
  console.log('Running production database migrations...');

  try {
    // Import your System model for table creation
    const { default: System } = await import('../src/models/system.js');

    // Create all tables
    const tableCount = await System.createTables(sql, process.env);
    console.log(`✅ Created ${tableCount} tables`);

    // Create indexes
    await System.createDatabaseIndexes(sql);
    console.log('✅ Database indexes created');

    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
```

Run the migration:

```bash
cd backend
node scripts/migrate-production.js
```

### 5. Build and Deploy

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Deploy to Cloudflare Workers
```bash
cd backend
wrangler deploy --env production
```

### 6. Post-Deployment Setup

#### Initialize Application

1. **Access your deployed application** at your Cloudflare Workers URL
2. **Complete the setup wizard** to create the first admin user
3. **Configure site settings** in the admin panel
4. **Activate necessary plugins**

#### Configure Custom Domain (Optional)

1. **Add custom domain in Cloudflare Dashboard**:
   - Go to Workers & Pages → Your Worker → Settings → Triggers
   - Add custom domain (e.g., `api.yourdomain.com`)

2. **Update CORS settings** in your backend code to include your custom domain

## 🔒 Security Configuration

### 1. Environment Security

```bash
# Rotate secrets regularly
wrangler secret put SECRET_KEY --env production
wrangler secret put AUTH_SECRET --env production
```

### 2. Database Security

```sql
-- Create read-only user for analytics (optional)
CREATE USER phraseworks_readonly WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO phraseworks_readonly;

-- Set up connection limits
ALTER ROLE phraseworks SET connection_limit = 100;
```

### 3. R2 Bucket Security

Configure bucket CORS policy:

```json
{
  "AllowedOrigins": [
    "https://yourdomain.com",
    "https://api.yourdomain.com"
  ],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}
```

## 📊 Monitoring & Logging

### 1. Cloudflare Analytics

Monitor your Workers deployment:
- **CPU Time**: Track execution time
- **Requests**: Monitor traffic patterns
- **Errors**: Watch for 5xx errors
- **Memory Usage**: Track resource consumption

### 2. Database Monitoring

Set up monitoring for:
- **Connection count**: Monitor connection pool usage
- **Query performance**: Track slow queries
- **Disk usage**: Monitor storage growth
- **Backup status**: Ensure regular backups

### 3. Application Logging

Add structured logging to your application:

```javascript
// In your resolvers
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'User logged in',
  userId: userId,
  ip: request.headers['cf-connecting-ip']
}));
```

## 🔄 Maintenance & Updates

### 1. Regular Updates

```bash
# Update dependencies
npm run install-all

# Rebuild and deploy
cd frontend && npm run build
cd ../backend && wrangler deploy --env production
```

### 2. Database Maintenance

```sql
-- Regular maintenance queries
VACUUM ANALYZE;
REINDEX DATABASE phraseworks_prod;

-- Check database size
SELECT pg_size_pretty(pg_database_size('phraseworks_prod'));
```

### 3. Backup Strategy

**Automated Database Backups**:
```bash
# Daily backup script
pg_dump -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME > backup-$(date +%Y%m%d).sql
```

**R2 File Backups**:
```bash
# Sync R2 bucket to another location
rclone sync r2:your-bucket r2:your-backup-bucket
```

## 🚨 Troubleshooting

### Common Deployment Issues

**Worker exceeds CPU time limit**:
- Check for infinite loops in resolvers
- Optimize database queries
- Add caching where appropriate

**Database connection errors**:
- Verify Hyperdrive configuration
- Check connection string format
- Ensure database allows connections from Cloudflare IPs

**R2 access denied**:
- Verify R2 API keys are correctly set
- Check bucket permissions
- Confirm R2 binding in wrangler.toml

**Memory errors**:
- Optimize data loading in resolvers
- Use DataLoaders effectively
- Consider implementing pagination

### Logs and Debugging

View Worker logs:
```bash
wrangler tail --env production
```

Check specific deployment:
```bash
wrangler deployments list --env production
```

### Performance Optimization

**Enable caching**:
```javascript
// Add caching headers
response.headers.set('Cache-Control', 'public, max-age=3600');
```

**Optimize queries**:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_posts_status_date ON pw_posts(post_status, post_date DESC);
```

## 🔄 Rollback Strategy

If deployment fails:

1. **Quick rollback**:
   ```bash
   wrangler rollback --env production
   ```

2. **Database rollback** (if schema changes):
   ```bash
   psql -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME < backup-previous.sql
   ```

3. **Verify functionality** after rollback

## 📞 Support

For deployment issues:
- 📚 [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- 🐛 [Report Deployment Issues](https://github.com/yourusername/phraseworks/issues)
- 💬 [Community Forum](https://community.phraseworks.com)
- 📧 [Email Support](mailto:support@phraseworks.com)

---

**Next Steps**: Once deployed, monitor your application performance and logs for optimal maintenance.