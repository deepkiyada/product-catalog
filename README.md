# Product Catalog

A modern, production-ready e-commerce product catalog built with Next.js 15, TypeScript, and Supabase. Features a complete product management system with CRUD operations, search, filtering, and responsive design.

## Features

- 🛍️ **Product Management**: Full CRUD operations for products
- 🔍 **Search & Filter**: Advanced search and category filtering
- 📱 **Responsive Design**: Mobile-first responsive layout
- 🎨 **Pure CSS**: No CSS frameworks, custom styling
- 🚀 **Performance Optimized**: Image optimization, caching, and compression
- 🔒 **Security Hardened**: Rate limiting, input validation, security headers
- 📊 **Production Ready**: Monitoring, logging, and error handling
- 🗄️ **Database**: Supabase integration for serverless compatibility
- ☁️ **Serverless Ready**: Vercel and Netlify deployment optimized

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Pure CSS with CSS Variables
- **State Management**: React Hooks
- **Image Optimization**: Next.js Image component
- **Deployment**: Vercel, Netlify (serverless-ready)

## Getting Started

### Development

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd product-catalog
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment:**

   ```bash
   cp .env.example .env.local
   ```

4. **Run development server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Production Deployment

For detailed production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick deployment options:**

- **Vercel**: `vercel --prod`
- **Docker**: `docker-compose up -d`
- **Build**: `npm run build:production`

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   └── layout.tsx      # Root layout
├── components/         # React components
├── lib/               # Utility libraries
│   ├── api.ts         # API client
│   ├── cache.ts       # Caching utilities
│   ├── errorHandler.ts # Error handling
│   ├── fileStorage.ts  # Data storage
│   ├── logger.ts      # Logging utilities
│   ├── rateLimit.ts   # Rate limiting
│   └── validation.ts  # Input validation
└── types/             # TypeScript types
```

## API Endpoints

- `GET /api/products` - List all products with filtering
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get specific product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/products/seed` - Seed sample data
- `GET /api/health` - Health check endpoint

## Scripts

```bash
# Development
npm run dev              # Start development server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Production
npm run build            # Build for production
npm run build:production # Build with production env
npm run start            # Start production server
npm run validate         # Run all checks

# Utilities
npm run clean            # Clean build artifacts
npm run export           # Export static site
```

## Environment Variables

See `.env.example` for all available environment variables:

- `NODE_ENV` - Environment (development/production)
- `NEXT_PUBLIC_API_URL` - Public API URL
- `RATE_LIMIT_MAX_REQUESTS` - Rate limiting configuration
- `LOG_LEVEL` - Logging level
- `ENABLE_COMPRESSION` - Enable gzip compression

## Production Features

### Security

- Rate limiting (100 req/15min per IP)
- Input validation and sanitization
- Security headers (CSP, HSTS, etc.)
- Error handling with proper logging

### Performance

- Image optimization with Next.js Image
- In-memory caching for API responses
- Compression and minification
- Static asset optimization

### Monitoring

- Health check endpoint (`/api/health`)
- Structured JSON logging
- Performance metrics
- Error tracking

### Deployment

- Docker containerization
- Vercel deployment configuration
- Traditional server deployment
- Environment-specific configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and validation: `npm run validate`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For deployment and production issues, refer to:

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- Health check endpoint: `/api/health`
- Application logs for troubleshooting
