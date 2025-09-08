import { NextRequest, NextResponse } from 'next/server';
import { readProducts } from '@/lib/fileStorage';
import { logInfo, logError } from '@/lib/logger';

// Health check endpoint for monitoring
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Check if the application is running
    const appStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    // Check database/file system health
    let dbStatus = 'healthy';
    let productCount = 0;
    
    try {
      const products = readProducts();
      productCount = products.length;
    } catch (error) {
      dbStatus = 'unhealthy';
      logError('Health check: Database/file system error', { error: error instanceof Error ? error.message : 'Unknown error' });
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryStatus = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    };

    const responseTime = Date.now() - startTime;
    
    const healthData = {
      ...appStatus,
      checks: {
        database: {
          status: dbStatus,
          productCount,
        },
        memory: memoryStatus,
        responseTime: `${responseTime}ms`,
      },
    };

    // Log health check
    logInfo('Health check performed', {
      responseTime,
      dbStatus,
      productCount,
      memoryUsage: memoryStatus,
    });

    // Return appropriate status code
    const statusCode = dbStatus === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    logError('Health check failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}
