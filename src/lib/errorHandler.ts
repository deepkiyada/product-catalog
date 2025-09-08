import { NextResponse } from 'next/server';
import { logError } from './logger';

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

// Global error handler for API routes
export function handleApiError(error: unknown, context?: string): NextResponse {
  // Log the error
  logError(
    `API Error${context ? ` in ${context}` : ''}`,
    {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      context,
    },
    error instanceof Error ? error : undefined
  );

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors
  if (error instanceof Error && error.name === 'ValidationError') {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Handle unknown errors
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return NextResponse.json(
    {
      success: false,
      error: isDevelopment 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Internal server error',
      ...(isDevelopment && error instanceof Error && { stack: error.stack }),
    },
    { status: 500 }
  );
}

// Async wrapper for API route handlers
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, context);
    }
  };
}
