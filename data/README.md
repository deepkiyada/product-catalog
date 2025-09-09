# Data Directory - Legacy Files

⚠️ **IMPORTANT**: This directory contains legacy files that are **NO LONGER USED**.

## Current Data Storage

All product data is now stored in **Supabase database**. The application uses:
- `src/lib/database.ts` - Database operations
- `src/lib/supabase.ts` - Database connection
- Supabase PostgreSQL database

## Legacy Files

- `products-legacy-backup.json` - Old JSON file (backup only)
- `products-backup-*.json` - Migration backups

## To Access Current Data

```bash
# API endpoint
curl http://localhost:3000/api/products

# Or visit the application directly
open http://localhost:3000
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These files are kept for reference only and are not used by the application.
