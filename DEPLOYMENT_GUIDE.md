# 🚀 Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Product Catalog application to production with Supabase integration.

## 📋 Prerequisites

- ✅ Node.js 20.0.0 or higher
- ✅ npm package manager
- ✅ Git repository
- ✅ Supabase account and project set up
- ✅ Vercel or Netlify account

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables Setup

Ensure you have your Supabase credentials ready:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Build Validation

Test your application locally before deployment:

```bash
# Install dependencies
npm ci

# Type checking
npm run type-check

# Linting
npm run lint

# Production build test
npm run build

# Test locally
npm run start
```

### 3. Database Setup

Ensure your Supabase database is ready:

```bash
# Run migration if needed
npm run migrate:supabase
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Method A: GitHub Integration (Easiest)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure Environment Variables:**
   - In project settings, go to "Environment Variables"
   - Add your variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
     NEXT_PUBLIC_APP_VERSION = 1.0.0
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Method B: CLI Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy:**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

### Option 2: Netlify

#### Method A: GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Deploy via Netlify Dashboard:**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings are auto-configured from `netlify.toml`

3. **Configure Environment Variables:**
   - In site settings, go to "Environment variables"
   - Add your variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
     NEXT_PUBLIC_APP_VERSION = 1.0.0
     ```

4. **Deploy:**
   - Click "Deploy site"
   - Your app will be live at `https://your-site-name.netlify.app`

#### Method B: CLI Deployment

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and Deploy:**
   ```bash
   netlify login
   netlify deploy --prod
   ```

## ✅ Post-Deployment Verification

### 1. Health Check

Test your deployed application:

```bash
# Replace with your actual domain
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "database": {
      "status": "healthy",
      "productCount": 4
    }
  }
}
```

### 2. API Endpoints Test

```bash
# Test products API
curl https://your-domain.com/api/products

# Test specific product
curl https://your-domain.com/api/products/[product-id]
```

### 3. Frontend Test

- Visit your deployed URL
- Verify products load correctly
- Test product filtering
- Check responsive design

## 🔄 Continuous Deployment

### Automatic Deployments

Both Vercel and Netlify support automatic deployments:

1. **Push to main branch** triggers automatic deployment
2. **Pull requests** create preview deployments
3. **Environment-specific** deployments for staging/production

### Manual Deployments

```bash
# Vercel
npm run deploy:vercel

# Netlify
npm run deploy:netlify
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check environment variables are set
   - Verify Node.js version (20+)
   - Run `npm run build` locally first

2. **Database Connection Errors:**
   - Verify Supabase URL and key
   - Check Supabase project is active
   - Test connection locally

3. **404 Errors:**
   - Check routing configuration
   - Verify build output
   - Check deployment logs

### Debug Commands

```bash
# Check build locally
npm run build && npm run start

# Analyze bundle size
npm run build:analyze

# Check health endpoint
npm run health-check
```

## 📊 Performance Monitoring

### Metrics to Monitor

- Page load times
- API response times
- Database query performance
- Error rates

### Tools

- Vercel Analytics (built-in)
- Netlify Analytics (built-in)
- Google PageSpeed Insights
- Lighthouse CI

## 🔒 Security Checklist

- ✅ Environment variables properly configured
- ✅ HTTPS enabled (automatic on Vercel/Netlify)
- ✅ Security headers configured
- ✅ No sensitive data in client-side code
- ✅ Supabase RLS policies configured

## 🎉 Success!

Your Product Catalog application is now deployed and ready for production use!

### Next Steps

1. Set up monitoring and alerts
2. Configure custom domain (optional)
3. Set up staging environment
4. Plan regular updates and maintenance

### Support

- Check deployment logs for issues
- Review [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- Test API endpoints with health check
- Monitor application performance
