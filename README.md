# Product Catalog - E-Commerce Management System

A comprehensive, production-ready e-commerce product catalog application built with modern web technologies. This system provides complete product management capabilities with advanced features including pagination, search, filtering, and responsive design optimized for both desktop and mobile platforms.

## 🎯 Project Overview

This application serves as a complete product catalog management system designed for e-commerce businesses. It demonstrates modern full-stack development practices with a focus on performance, scalability, and user experience. The system supports real-time product management and advanced search capabilities for efficient product inventory management.

## ✨ Key Features

### Core Functionality

- 🛍️ **Complete Product Management**: Full CRUD operations with validation
- **Intelligent Search**: Real-time search across product names and categories
- 🏷️ **Category Filtering**: Dynamic category-based product filtering
- 📱 **Responsive Design**: Mobile-first approach with adaptive layouts
- 🎨 **Pure CSS Styling**: Custom CSS without external frameworks

### Technical Features

- 🚀 **Performance Optimized**: Image optimization, caching, and compression
- 🔒 **Security Hardened**: Input validation, rate limiting, and security headers
- 📊 **Production Ready**: Comprehensive logging, monitoring, and error handling
- 🗄️ **Database Integration**: Supabase PostgreSQL with real-time capabilities
- ☁️ **Serverless Architecture**: Optimized for Vercel and Netlify deployment
- 🔄 **Real-time Updates**: Live product updates with optimistic UI patterns

## 🛠️ Technology Stack

### Frontend Architecture

- **Framework**: Next.js 15 with App Router (React 19)
- **Language**: TypeScript 5.9 with strict type checking
- **Styling**: Pure CSS with CSS Variables and responsive design
- **State Management**: React Hooks with optimized re-rendering
- **UI Components**: Custom components with accessibility features
- **Icons**: Lucide React for consistent iconography

### Backend & Database

- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **API**: Next.js API Routes with RESTful design
- **Authentication**: Supabase Auth (ready for implementation)
- **File Storage**: Supabase Storage for product images
- **Caching**: In-memory caching with Redis-compatible interface

### Development & Deployment

- **Build Tool**: Next.js with Webpack 5 and SWC compiler
- **Type Checking**: TypeScript with strict configuration
- **Linting**: ESLint with Next.js recommended rules
- **Deployment**: Vercel, Netlify with serverless functions
- **Containerization**: Docker with multi-stage builds
- **Monitoring**: Built-in health checks and logging

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (or yarn/pnpm equivalent)
- **Supabase Account**: For database and authentication services
- **Git**: For version control

### Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd product-catalog
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Application Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NODE_ENV=development

   # Optional: Performance & Security
   RATE_LIMIT_MAX_REQUESTS=100
   LOG_LEVEL=info
   ENABLE_COMPRESSION=true
   ```

4. **Database Setup**

   ```bash
   # Run database migrations (if using Supabase CLI)
   npx supabase db reset

   # Or use the migration script
   npm run migrate:supabase
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

6. **Seed Sample Data** (Optional)
   ```bash
   # Visit http://localhost:3000/api-test to seed sample products
   # Or use the API endpoint directly
   curl -X POST http://localhost:3000/api/products/seed
   ```

### Production Deployment

For detailed production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick deployment options:**

- **Vercel**: `vercel --prod`
- **Docker**: `docker-compose up -d`
- **Build**: `npm run build:production`

## 📁 Project Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── products/      # Product CRUD operations
│   │   ├── health/        # Health check endpoint
│   │   ├── images/        # Image management
│   │   └── upload/        # File upload handling
│   ├── products/          # Product pages
│   ├── about/             # About page
│   ├── api-test/          # API testing interface
│   ├── globals.css        # Global styles & CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React Components
│   ├── ProductCatalog.tsx # Main product listing component
│   └── AddProductModal.tsx # Product creation modal
├── lib/                   # Utility Libraries
│   ├── api.ts            # API client for product operations
│   ├── database.ts       # Database operations & queries
│   ├── supabase.ts       # Supabase client configuration
│   ├── sampleData.ts     # Sample product data
│   └── imageManager.ts   # Image handling utilities
└── types/                # TypeScript Type Definitions
    ├── product.ts        # Product and API types
    └── database.ts       # Database schema types
```

## 🔌 API Documentation

### Products API

#### GET /api/products

Retrieve products with optional filtering.

**Query Parameters:**

- `category` (string, optional): Filter by category
- `search` (string, optional): Search in product names and categories
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter
- `featured` (boolean, optional): Filter featured products

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "price": 99.99,
      "originalPrice": 129.99,
      "category": "Category Name",
      "image": "/path/to/image.jpg",
      "images": ["/path/to/image1.jpg"],
      "featured": true,
      "tags": ["tag1", "tag2"]
    }
  ],
  "count": 12
}
```

#### POST /api/products

Create a new product.

**Request Body:**

```json
{
  "name": "Product Name",
  "price": 99.99,
  "originalPrice": 129.99,
  "category": "Category Name",
  "image": "/path/to/image.jpg",
  "images": ["/path/to/image1.jpg"],
  "featured": false,
  "tags": ["tag1", "tag2"]
}
```

#### GET /api/products/[id]

Retrieve a specific product by ID.

#### PUT /api/products/[id]

Update an existing product.

#### DELETE /api/products/[id]

Delete a product by ID.

#### POST /api/products/seed

Seed the database with sample products.

### Utility APIs

#### GET /api/health

Health check endpoint for monitoring.

#### GET /api/images

Image management and statistics.

#### POST /api/upload

Handle file uploads for product images.

## 📜 Available Scripts

### Development Commands

```bash
npm run dev              # Start development server with hot reload
npm run lint             # Run ESLint for code quality checks
npm run lint:fix         # Auto-fix ESLint issues
npm run type-check       # TypeScript type checking
npm run validate         # Run type-check and lint together
```

### Production Commands

```bash
npm run build            # Build for production
npm run build:production # Build with production environment
npm run build:analyze    # Build with bundle analyzer
npm run start            # Start production server
npm run start:production # Start with production environment
```

### Utility Commands

```bash
npm run clean            # Clean build artifacts
npm run export           # Export static site
npm run migrate:supabase # Run database migrations
npm run health-check     # Check application health
npm run serve            # Serve built application locally
```

### Deployment Commands

```bash
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:netlify   # Deploy to Netlify
npm run build:netlify    # Build for Netlify deployment
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Required - Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# Optional - Performance & Security
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
ENABLE_COMPRESSION=true
NEXT_TELEMETRY_DISABLED=1

# Optional - Development
ANALYZE=false
DEBUG=false
```

### Database Schema

The application uses the following Supabase table structure:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created_at ON products(created_at);
```

## 🚀 Production Features

### Security & Performance

- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Input Validation**: Comprehensive validation and sanitization
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching Strategy**: In-memory caching for API responses
- **Compression**: Gzip compression for static assets
- **Error Handling**: Structured error logging and user-friendly messages

### Monitoring & Observability

- **Health Checks**: `/api/health` endpoint for uptime monitoring
- **Structured Logging**: JSON-formatted logs with different levels
- **Performance Metrics**: Built-in performance tracking
- **Error Tracking**: Comprehensive error logging and reporting

### Deployment Options

- **Vercel**: Optimized for serverless deployment
- **Netlify**: Static site generation with serverless functions
- **Docker**: Containerized deployment for any platform
- **Traditional Servers**: Standard Node.js server deployment

## 🏗️ Development Guidelines

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Enforced code style and best practices
- **Component Architecture**: Reusable, accessible components
- **API Design**: RESTful endpoints with consistent responses
- **Error Handling**: Graceful error handling throughout the application

### Testing Strategy

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Validate entire codebase
npm run validate

# Test API endpoints
curl http://localhost:3000/api/health
```

### Performance Optimization

- Optimized database queries with proper indexing
- Image optimization and lazy loading
- Efficient state management with React hooks
- Minimal bundle size with tree shaking

## 📋 Deployment Guide

### Quick Deployment

**Vercel (Recommended)**

```bash
npm install -g vercel
vercel --prod
```

**Netlify**

```bash
npm run build:netlify
netlify deploy --prod --dir=.next
```

**Docker**

```bash
docker-compose up -d
```

### Environment Setup for Production

1. Set up Supabase project and configure environment variables
2. Configure domain and SSL certificates
3. Set up monitoring and logging
4. Configure CDN for static assets
5. Set up backup strategies for database

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Your Changes**
   - Follow TypeScript and ESLint guidelines
   - Add appropriate tests
   - Update documentation if needed
4. **Validate Your Changes**
   ```bash
   npm run validate
   ```
5. **Submit a Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Development Setup for Contributors

```bash
git clone <your-fork-url>
cd product-catalog
npm install
cp .env.example .env.local
# Configure your environment variables
npm run dev
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

- **Database Connection**: Verify Supabase credentials in `.env.local`
- **Build Errors**: Run `npm run type-check` to identify TypeScript issues
- **Performance Issues**: Check network tab for API response times

### Getting Help

- **Documentation**: Comprehensive guides in `/docs` directory
- **API Testing**: Use `/api-test` page for interactive API testing
- **Health Check**: Monitor application status at `/api/health`
- **Logs**: Check application logs for detailed error information

### Additional Resources

- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Environment Variables](./ENVIRONMENT_VARIABLES.md) - Complete environment setup
- [API Documentation](./docs/api.md) - Detailed API reference
- [Supabase Integration](./SUPABASE_INTEGRATION.md) - Database setup guide

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
