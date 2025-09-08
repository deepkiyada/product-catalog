# Kitchen365 Product Catalog - Production Deployment Guide

## Overview

This guide covers the complete production deployment process for the Kitchen365 Product Catalog application.

## Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn package manager
- Git for version control
- Production server or cloud platform account

## Environment Setup

### 1. Environment Variables

Copy the environment template and configure for production:

```bash
cp .env.example .env.production
```

Required environment variables:
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL` - Your production API URL
- `API_BASE_URL` - Internal API base URL
- `DATA_DIRECTORY` - Directory for data storage
- `LOG_LEVEL` - Logging level (warn/error for production)

### 2. Build Validation

Before deployment, validate the build:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build:production

# Test the build locally
npm run start:production
```

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables:**
   - Go to Vercel dashboard
   - Add production environment variables
   - Redeploy if needed

### Option 2: Docker Deployment

1. **Build Docker Image:**
   ```bash
   docker build -t kitchen365-catalog .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Or run standalone:**
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e NEXT_PUBLIC_API_URL=https://yourdomain.com/api \
     -v $(pwd)/data:/app/data \
     kitchen365-catalog
   ```

### Option 3: Traditional Server Deployment

1. **Build the application:**
   ```bash
   npm run build:production
   ```

2. **Copy files to server:**
   ```bash
   rsync -av --exclude node_modules . user@server:/path/to/app/
   ```

3. **Install dependencies on server:**
   ```bash
   npm ci --only=production
   ```

4. **Start with PM2:**
   ```bash
   pm2 start npm --name "kitchen365" -- start
   ```

## Production Configuration

### Security Headers

The application includes security headers configured in `next.config.ts`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy for camera, microphone, geolocation

### Rate Limiting

Built-in rate limiting is configured:
- 100 requests per 15 minutes per IP
- Configurable via environment variables
- Automatic cleanup of expired entries

### Caching Strategy

- Static assets: 1 year cache
- API responses: 5 minutes cache
- Images: Optimized with Next.js Image component
- In-memory caching for frequently accessed data

## Monitoring and Health Checks

### Health Check Endpoint

Monitor application health at `/api/health`:

```bash
curl https://yourdomain.com/api/health
```

Response includes:
- Application status
- Database/file system health
- Memory usage
- Response time

### Logging

Logs are structured JSON in production:
- Error logs include stack traces
- Request/response logging
- Performance metrics
- Configurable log levels

### Monitoring Setup

1. **Application Monitoring:**
   - Use health check endpoint
   - Monitor response times
   - Track error rates

2. **Infrastructure Monitoring:**
   - CPU and memory usage
   - Disk space (for data directory)
   - Network connectivity

## Maintenance Procedures

### Regular Maintenance

1. **Update Dependencies:**
   ```bash
   npm audit
   npm update
   npm run validate
   ```

2. **Log Rotation:**
   - Configure log rotation for production
   - Archive old logs
   - Monitor disk usage

3. **Data Backup:**
   ```bash
   # Backup product data
   cp data/products.json backups/products-$(date +%Y%m%d).json
   ```

### Troubleshooting

1. **Application Won't Start:**
   - Check environment variables
   - Verify Node.js version
   - Check file permissions

2. **High Memory Usage:**
   - Monitor cache size
   - Check for memory leaks
   - Restart application if needed

3. **Slow Response Times:**
   - Check cache hit rates
   - Monitor database performance
   - Analyze slow queries

### Performance Optimization

1. **CDN Setup:**
   - Configure CDN for static assets
   - Enable compression
   - Set appropriate cache headers

2. **Database Optimization:**
   - Consider migrating to a proper database for large datasets
   - Implement database indexing
   - Use connection pooling

## Security Considerations

1. **Regular Security Updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

2. **Access Control:**
   - Implement authentication if needed
   - Use HTTPS in production
   - Configure firewall rules

3. **Data Protection:**
   - Backup data regularly
   - Encrypt sensitive data
   - Implement proper error handling

## Rollback Procedures

1. **Quick Rollback:**
   ```bash
   # Revert to previous deployment
   vercel --prod --force
   ```

2. **Manual Rollback:**
   ```bash
   # Restore from backup
   git checkout previous-stable-tag
   npm run build:production
   npm run start:production
   ```

## Support and Maintenance

For production issues:
1. Check application logs
2. Verify health check endpoint
3. Monitor system resources
4. Review recent changes
5. Contact development team if needed

## Performance Benchmarks

Expected performance metrics:
- Page load time: < 2 seconds
- API response time: < 500ms
- Time to first byte: < 200ms
- Lighthouse score: > 90
