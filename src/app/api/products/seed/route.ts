import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts } from '@/lib/fileStorage';
import { sampleProducts } from '@/lib/sampleData';
import { generateId } from '@/lib/fileStorage';

// POST /api/products/seed - Seed the database with sample products
export async function POST(request: NextRequest) {
  try {
    const existingProducts = readProducts();
    
    // Check if products already exist
    if (existingProducts.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Products already exist. Use force=true to overwrite.',
        count: existingProducts.length
      }, { status: 400 });
    }
    
    // Add IDs to sample products
    const productsWithIds = sampleProducts.map(product => ({
      ...product,
      id: generateId()
    }));
    
    // Write to file
    writeProducts(productsWithIds);
    
    return NextResponse.json({
      success: true,
      message: 'Sample products seeded successfully',
      count: productsWithIds.length,
      data: productsWithIds
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed products' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/seed - Clear all products (for development)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force');
    
    if (force !== 'true') {
      return NextResponse.json({
        success: false,
        error: 'Use force=true to confirm deletion of all products'
      }, { status: 400 });
    }
    
    // Clear all products
    writeProducts([]);
    
    return NextResponse.json({
      success: true,
      message: 'All products cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear products' },
      { status: 500 }
    );
  }
}
