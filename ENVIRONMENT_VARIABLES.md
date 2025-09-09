# Environment Variables Guide

This document describes all environment variables used in the Product Catalog application.

## ✅ Current Data Storage: Supabase Database

**Important**: This application now uses Supabase PostgreSQL database for all data storage. Local JSON files are no longer used.

## Required Variables

### Supabase Configuration (Required for both Local & Production)

| Variable                        | Description                   | Example                                   | Required |
| ------------------------------- | ----------------------------- | ----------------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL     | `https://abc123.supabase.co`              | ✅ Yes   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Yes   |

### ⚠️ Data Synchronization

Both local and production environments connect to the **same Supabase database**, so:

- ✅ Data is automatically synchronized
- ✅ Changes in local development appear in production
- ✅ Changes in production appear in local development

### Optional Variables

| Variable                    | Description                           | Default           | Required |
| --------------------------- | ------------------------------------- | ----------------- | -------- |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | -                 | ❌ No    |
| `NEXT_PUBLIC_APP_VERSION`   | Application version                   | `1.0.0`           | ❌ No    |
| `NEXT_PUBLIC_APP_NAME`      | Application name                      | `Product Catalog` | ❌ No    |
| `NODE_ENV`                  | Environment mode                      | `development`     | ❌ No    |

## Platform-Specific Setup

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Netlify Deployment

1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Local Development

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Update the values with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Getting Supabase Credentials

1. **Sign up/Login to Supabase**: Go to [supabase.com](https://supabase.com)
2. **Create a new project** or select existing project
3. **Get your credentials**:
   - Go to Settings → API
   - Copy the "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Public vs Private Keys**:

   - `NEXT_PUBLIC_*` variables are exposed to the browser
   - Never put sensitive data in `NEXT_PUBLIC_*` variables
   - The anon key is safe to expose as it has limited permissions

2. **Service Role Key**:

   - Only use if you need admin operations
   - Never expose this key to the browser
   - Keep it secure and rotate regularly

3. **Environment Separation**:
   - Use different Supabase projects for development/production
   - Never use production credentials in development

## Validation

The application validates required environment variables on startup. If any required variables are missing, the application will fail to start with a clear error message.

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**:

   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   - Check for typos in variable names
   - Verify the values are correct

2. **Database connection errors**:

   - Verify your Supabase project is active
   - Check if the URL and key are correct
   - Ensure your database has the required tables

3. **Variables not updating**:
   - Restart your development server after changing `.env.local`
   - For production deployments, redeploy after updating environment variables

### Testing Environment Variables

You can test if your environment variables are properly configured by visiting the health check endpoint:

```bash
curl https://your-domain.com/api/health
```

This will show if the database connection is working properly.
