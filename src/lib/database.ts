import { supabase, createServerClient } from '@/lib/supabase'
import { Product } from '@/types/product'
import { ProductRow, ProductInsert, ProductUpdate } from '@/types/database'

// Helper function to convert database row to Product type
function dbRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price || undefined,
    category: row.category,
    image: row.image,
    images: row.images || undefined,
    featured: row.featured || false,
    tags: row.tags || undefined,
  }
}

// Helper function to convert Product to database insert
function productToDbInsert(product: Omit<Product, 'id'>): ProductInsert {
  return {
    name: product.name,
    price: product.price,
    original_price: product.originalPrice || null,
    category: product.category,
    image: product.image,
    images: product.images || null,
    featured: product.featured || false,
    tags: product.tags || null,
  }
}

// Read all products from database
export async function readProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error reading products:', error)
      throw new Error(`Failed to read products: ${error.message}`)
    }

    return data ? data.map(dbRowToProduct) : []
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

// Add new product to database
export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    const insertData = productToDbInsert(productData)
    
    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      throw new Error(`Failed to add product: ${error.message}`)
    }

    return dbRowToProduct(data)
  } catch (error) {
    console.error('Error adding product:', error)
    throw new Error('Failed to add product')
  }
}

// Find product by ID
export async function findProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error finding product:', error)
      throw new Error(`Failed to find product: ${error.message}`)
    }

    return data ? dbRowToProduct(data) : null
  } catch (error) {
    console.error('Error finding product:', error)
    return null
  }
}

// Update existing product
export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  try {
    const updateData: ProductUpdate = {}
    
    if (productData.name !== undefined) updateData.name = productData.name
    if (productData.price !== undefined) updateData.price = productData.price
    if (productData.originalPrice !== undefined) updateData.original_price = productData.originalPrice || null
    if (productData.category !== undefined) updateData.category = productData.category
    if (productData.image !== undefined) updateData.image = productData.image
    if (productData.images !== undefined) updateData.images = productData.images || null
    if (productData.featured !== undefined) updateData.featured = productData.featured
    if (productData.tags !== undefined) updateData.tags = productData.tags || null
    
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data ? dbRowToProduct(data) : null
  } catch (error) {
    console.error('Error updating product:', error)
    return null
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}

// Filter products with database queries
export async function filterProducts(filters: {
  category?: string
  priceRange?: { min: number; max: number }
  search?: string
  featured?: boolean
}): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*')

    // Apply category filter
    if (filters.category) {
      query = query.ilike('category', filters.category)
    }

    // Apply price range filter
    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max)
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    // Apply search filter (searches in name, category, and tags)
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`
      query = query.or(`name.ilike.${searchTerm},category.ilike.${searchTerm}`)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error filtering products:', error)
      throw new Error(`Failed to filter products: ${error.message}`)
    }

    return data ? data.map(dbRowToProduct) : []
  } catch (error) {
    console.error('Error filtering products:', error)
    return []
  }
}

// Bulk insert products (for seeding)
export async function bulkInsertProducts(products: Omit<Product, 'id'>[]): Promise<Product[]> {
  try {
    const insertData = products.map(productToDbInsert)
    
    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()

    if (error) {
      console.error('Error bulk inserting products:', error)
      throw new Error(`Failed to bulk insert products: ${error.message}`)
    }

    return data ? data.map(dbRowToProduct) : []
  } catch (error) {
    console.error('Error bulk inserting products:', error)
    throw new Error('Failed to bulk insert products')
  }
}

// Clear all products (for development/testing)
export async function clearAllProducts(): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

    if (error) {
      console.error('Error clearing products:', error)
      throw new Error(`Failed to clear products: ${error.message}`)
    }
  } catch (error) {
    console.error('Error clearing products:', error)
    throw new Error('Failed to clear products')
  }
}

// Get products count
export async function getProductsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error getting products count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error getting products count:', error)
    return 0
  }
}
