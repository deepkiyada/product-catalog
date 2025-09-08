import { ValidationError } from './errorHandler';

// Input sanitization and validation utilities

export function sanitizeString(input: string, maxLength: number = 255): string {
  if (typeof input !== 'string') {
    throw new ValidationError('Input must be a string');
  }
  
  // Remove potentially dangerous characters
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, maxLength);
    
  return sanitized;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePrice(price: any): number {
  const numPrice = Number(price);
  
  if (isNaN(numPrice) || numPrice < 0) {
    throw new ValidationError('Price must be a positive number');
  }
  
  if (numPrice > 999999.99) {
    throw new ValidationError('Price cannot exceed $999,999.99');
  }
  
  return Math.round(numPrice * 100) / 100; // Round to 2 decimal places
}

export function validateProductName(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Product name is required');
  }
  
  const sanitized = sanitizeString(name, 100);
  
  if (sanitized.length < 2) {
    throw new ValidationError('Product name must be at least 2 characters long');
  }
  
  return sanitized;
}

export function validateCategory(category: string): string {
  if (!category || typeof category !== 'string') {
    throw new ValidationError('Category is required');
  }
  
  const sanitized = sanitizeString(category, 50);
  
  if (sanitized.length < 2) {
    throw new ValidationError('Category must be at least 2 characters long');
  }
  
  return sanitized;
}

export function validateImageUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('Image URL is required');
  }
  
  // Allow relative URLs and common image hosting domains
  const allowedPatterns = [
    /^\//, // Relative URLs
    /^https:\/\//, // HTTPS URLs
    /^data:image\//, // Data URLs
  ];
  
  const isValid = allowedPatterns.some(pattern => pattern.test(url));
  
  if (!isValid) {
    throw new ValidationError('Invalid image URL format');
  }
  
  return sanitizeString(url, 500);
}

export function validateTags(tags: any): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }
  
  return tags
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .map(tag => sanitizeString(tag, 30))
    .slice(0, 10); // Limit to 10 tags
}

export function validateId(id: string): string {
  if (!id || typeof id !== 'string') {
    throw new ValidationError('ID is required');
  }
  
  // Allow alphanumeric characters, hyphens, and underscores
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  
  if (!idRegex.test(id) || id.length > 50) {
    throw new ValidationError('Invalid ID format');
  }
  
  return id;
}

// Validate entire product object
export function validateProductData(data: any) {
  const errors: string[] = [];
  
  try {
    validateProductName(data.name);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Invalid name');
  }
  
  try {
    validatePrice(data.price);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Invalid price');
  }
  
  try {
    validateCategory(data.category);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Invalid category');
  }
  
  try {
    validateImageUrl(data.image);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Invalid image URL');
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', { errors });
  }
  
  return {
    name: validateProductName(data.name),
    price: validatePrice(data.price),
    originalPrice: data.originalPrice ? validatePrice(data.originalPrice) : undefined,
    category: validateCategory(data.category),
    image: validateImageUrl(data.image),
    images: Array.isArray(data.images) 
      ? data.images.map((url: string) => validateImageUrl(url))
      : [],
    featured: Boolean(data.featured),
    tags: validateTags(data.tags),
  };
}
